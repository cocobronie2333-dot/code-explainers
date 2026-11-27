"use strict";

const evidence = window.qwenEvidence;
const byId = id => document.getElementById(id);
const integer = value => value.toLocaleString("en-US");
const GIB = 2 ** 30;
const gib = bytes => (bytes / GIB).toFixed(2) + " GiB";
const cacheSource = "https://app.notion.com/p/40d498fd324f811684c9cba91489e771";

function setPressed(container, key, value) {
  for (const button of container.querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(button.dataset[key] === String(value)));
  }
}

function selectFrom(container, key, action) {
  container.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (button?.dataset[key]) action(button.dataset[key]);
  });
}

const profilePicker = byId("profile-picker");
const profileNames = {
  A: "HBM + MooncakePush",
  B: "AscendStore layerwise，无 offload",
  C: "AscendStore layerwise + Prefill offload",
  D: "HBM + AscendStore layerwise + Prefill offload",
};
const profileMax = Math.max(...Object.values(evidence.profiles).map(profile => profile.operations[0].ms));
function renderProfile(phase) {
  setPressed(profilePicker, "profile", phase);
  const profile = evidence.profiles[phase];
  byId("profile-note").textContent = `${phase} 组 · ${profileNames[phase]} · ${integer(profile.rows)} 条 kernel 记录`;
  byId("profile-chart").innerHTML = profile.operations.slice(0, 8).map(operation => `
    <div class="chart-row" aria-label="${operation.name}，${integer(operation.count)} 次，累计 ${operation.ms.toFixed(2)} ms">
      <code>${operation.name}</code>
      <span class="bar-track" aria-hidden="true"><span class="bar-fill" style="width:${100 * operation.ms / profileMax}%"></span></span>
      <span class="chart-time">${(operation.ms / 1000).toFixed(3)} s</span>
      <span class="chart-count">${integer(operation.count)} 次</span></div>`).join("");
}
selectFrom(profilePicker, "profile", renderProfile);

const snapshot = byId("cache-snapshot");
for (const [key, config] of Object.entries(evidence.cache)) {
  snapshot.add(new Option(config.label, key));
}
snapshot.value = "b48";
const booleanWord = value => value ? "是" : "否";
const cacheGroupLabels = ["QSA raw indexer", "QSA KV / compressed", "GDN state A", "GDN state B", "GDN state C", "PLE short-conv"];
const cacheTypeNames = {
  "self_attn.indexer.raw_key_cache": "Raw ring",
  "self_attn.indexer.compressed_key_cache": "Compressed indexer",
  "self_attn.attn": "Main K / V",
  "linear_attn": "Conv + recurrent",
  ple: "PLE short-conv",
};
const cacheDtypes = { bfloat16: { label: "BF16", bytes: 2 }, float32: { label: "FP32", bytes: 4 } };
const cacheMatrixRows = byId("cache-matrix-rows");
const cacheView = byId("cache-view");
const cacheShapeMode = byId("cache-shape-mode");
let cacheShape = "pool";
const decimalMegabytes = bytes => (bytes / 1e6).toFixed(4);
const tensorShape = dimensions => `[${dimensions.join(",")}]`;

function cacheSpec(member) {
  const kind = member.owner.slice(member.owner.indexOf(".") + 1);
  const types = member.dtypes.map(dtype => cacheDtypes[dtype]);
  // The exported GDN size can include page padding. Use shape and dtype for payload.
  const payload = member.shapes.reduce((sum, shape, i) =>
    sum + shape.reduce((n, dimension) => n * dimension, types[i].bytes), 0);
  return { name: cacheTypeNames[kind], types, payload };
}

function cacheSlices(config) {
  const ownerGroups = new Map();
  config.groups.forEach((group, groupId) => group.members.forEach((member, memberId) => {
    ownerGroups.set(member.owner, { groupId, memberId, member });
  }));
  const slices = new Map();
  config.descriptors.forEach((tensor, tensorId) => tensor.layers.forEach((owner, ordinal) => {
    const entry = ownerGroups.get(owner);
    const offset = tensor.offset + ordinal * tensor.layer_stride;
    const key = `${tensor.size}:${offset}:${tensor.block_stride}`;
    if (!slices.has(key)) slices.set(key, { offset, stride: tensor.block_stride, groups: config.groups.map(() => []), tensors: new Set() });
    const slice = slices.get(key);
    slice.groups[entry.groupId].push({ ...entry, tensorId });
    slice.tensors.add(tensorId);
  }));
  return [...slices.values()];
}

function cacheLayerCell(entry, stride, blocks) {
  const { member, tensorId, groupId, memberId } = entry;
  const { name, payload } = cacheSpec(member);
  const shapes = member.shapes.map(shape => tensorShape(cacheShape === "pool" ? [blocks, ...shape] : shape));
  const layer = `L${member.owner.split(".")[0].padStart(2, "0")}`;
  const view = shapes.every(shape => shape === shapes[0]) && shapes.length > 1
    ? `${shapes.length}×${shapes[0]}` : shapes.join("+<wbr>");
  return `<button class="cache-cell cache-g${groupId}" type="button" data-view="${tensorId}:${groupId}:${memberId}" aria-haspopup="dialog" title="${name} · ${member.owner}">
      <span class="cache-cell-shape"><b>${layer}</b> ${view}</span>
      <span class="cache-cell-bytes">data=${decimalMegabytes(payload)} · pad=${decimalMegabytes(stride - payload)} MB</span>
    </button>`;
}

function renderCacheMatrix(config) {
  byId("cache-matrix-head").innerHTML = `<tr><th scope="col">KVCacheTensor<small>字节视图 · INT8</small></th>
    ${config.groups.map((group, i) => `<th scope="col" class="cache-g${i}" title="${group.name}">
      <strong>Group ${i} · ${cacheGroupLabels[i]}</strong><small>${group.members.length} 个 spec · block=${group.blockSize}</small></th>`).join("")}</tr>`;
  cacheMatrixRows.innerHTML = cacheSlices(config).map(({ offset, stride, groups, tensors }, index) => {
    const size = config.blocks * stride;
    const references = [...tensors].map(id => `T${id}`).join(" / ");
    return `<tr>
      <th scope="row" title="backing 内偏移 ${integer(offset)} B · block stride ${integer(stride)} B">
        <span class="cache-tensor-title"><b>${String(index + 1).padStart(2, "0")}</b> ${references}</span><span class="cache-tensor-bytes">[${size}] i8 · ${decimalMegabytes(size)} MB</span></th>
      ${groups.map(entries => entries.length
        ? `<td>${entries.map(entry => cacheLayerCell(entry, stride, config.blocks)).join("")}</td>`
        : `<td class="cache-empty" aria-label="无映射">—</td>`).join("")}</tr>`;
  }).join("");
}

function showCacheView(view) {
  const [tensorId, groupId, memberId] = view.split(":").map(Number);
  const config = evidence.cache[snapshot.value];
  const tensor = config.descriptors[tensorId];
  const group = config.groups[groupId];
  const member = group.members[memberId];
  const { name, types, payload } = cacheSpec(member);
  const offset = tensor.offset + tensor.layers.indexOf(member.owner) * tensor.layer_stride;
  const shapes = member.shapes.map((shape, i) => `${tensorShape(shape)} ${types[i].label}`).join(" + ");
  const poolShapes = member.shapes.map((shape, i) => `${tensorShape([config.blocks, ...shape])} ${types[i].label}`).join(" + ");
  byId("cache-view-title").textContent = `T${tensorId} · Group ${groupId} · L${member.owner.split(".")[0]} · ${name}`;
  byId("cache-view-body").innerHTML = `
    <p class="cache-view-meta">${config.label} · ${group.blockSize} tokens / block · 前缀复用 ${booleanWord(group.prefix)} · DCP 分片 ${booleanWord(group.dcp)} · 可传输 ${booleanWord(group.transfer)}</p>
    <dl class="cache-view-fields">
      <div><dt>引用存储</dt><dd>${integer(tensor.size)} B</dd></div>
      <div><dt>Block stride</dt><dd>${integer(tensor.block_stride)} B</dd></div>
      <div><dt>Layer stride</dt><dd>${integer(tensor.layer_stride)} B</dd></div>
      <div><dt>描述符偏移</dt><dd>${integer(tensor.offset)} B</dd></div>
      <div><dt>该层视图偏移</dt><dd>${integer(offset)} B</dd></div>
    </dl>
    <section class="cache-view-spec">
      <h3><code>${member.owner} · ${member.spec}</code></h3>
      <dl class="cache-shape-detail">
        <div><dt>每块 shape</dt><dd><code>${shapes}</code></dd></div>
        <div><dt>全池逻辑 shape</dt><dd><code>${poolShapes}</code></dd></div>
      </dl>
      <dl class="cache-view-fields">
        <div><dt>有效数据</dt><dd>${integer(payload)} B</dd></div>
        <div><dt>Spec 页</dt><dd>${integer(member.nominal)} B</dd></div>
        <div><dt>Spec padding</dt><dd>${integer(member.nominal - payload)} B</dd></div>
        <div><dt>实际 stride padding</dt><dd>${integer(tensor.block_stride - payload)} B</dd></div>
      </dl>
    </section>`;
  cacheView.showModal();
}
selectFrom(cacheMatrixRows, "view", showCacheView);
selectFrom(cacheShapeMode, "shape", mode => {
  cacheShape = mode;
  setPressed(cacheShapeMode, "shape", mode);
  renderCacheMatrix(evidence.cache[snapshot.value]);
});

function renderCacheSummary(config, isPlan) {
  const blockSize = config.alignment;
  const bytesPerId = config.unitBytes;
  const million = 2 ** 20;
  const reserveIds = 9; // 1 raw ring + 2 align-mode state pages for each of G2–G5.
  const maxModelLen = isPlan ? 8192 : 131104;
  const scenario = (length, requests) => {
    const ids = 1 + requests * (Math.ceil(length / blockSize) + reserveIds);
    const capacity = ids > config.blocks ? "超出当前缓存池" : "可装入当前缓存池";
    const lengthLimit = length > maxModelLen ? " · 超出单请求长度上限" : "";
    return `<strong>${gib(bytesPerId * ids)} / rank</strong><small>${integer(ids)} ID · ${capacity}${lengthLimit}</small>`;
  };
  byId("cache-summary").innerHTML = `
    <div class="cache-summary-top"><p>48 层 · TP8 / EP · BF16 KV · GDN/PLE align · MTP 关闭</p>
      <p>${isPlan ? "规划预分配" : "实际预分配"} <strong title="${integer(config.bytes)} B">${gib(config.bytes)} / rank</strong> · ${integer(config.blocks)} blocks</p></div>
    <div class="cache-summary-stats">
      <div><span>KV 占用斜率</span><strong>${gib(bytesPerId * million / blockSize)} / 1M tokens</strong><small>${integer(bytesPerId)} B / ID · ${blockSize} tokens / QSA block</small></div>
      <div><span>单条 1M · 容量估算</span>${scenario(million, 1)}</div>
      <div><span>8 × 128K · 容量估算</span>${scenario(million / 8, 8)}</div>
    </div>
    <div class="cache-summary-note">
      <p>1M = 1,048,576 tokens。无跨请求前缀共享时，缓存池需求 = 每 ID 字节 × [1 + Σ(⌈Lᵢ / ${blockSize}⌉ + ${reserveIds})]。1 为池内 null ID，${reserveIds} = 1 个 Raw ring + 4 个状态组 × 2。</p>
      <p>当前模型长度上限 ${integer(maxModelLen)} tokens。估算范围为设备侧 KV 池。${isPlan ? "A3 快照导出后，服务初始化失败。" : "950PR 实测为单条 128K。"}</p>
    </div>`;
}

function renderCache() {
  const key = snapshot.value;
  const config = evidence.cache[key];
  const isPlan = key === "a3";
  byId("cache-context").textContent = `${config.label} · ${config.date} · W8A8 · V2 eager · ${config.layout} · ${config.descriptors.length} 个描述符`;
  byId("backing-note").textContent = config.pleSeparate
    ? "同一行对齐共享 backing、地址和步长的视图。QSA 主 KV 与 GDN 的行可共用地址，PLE 独立分配。"
    : "同一行对齐共享 backing、地址和步长的视图。轮转槽在不同时间服务多个层，多个 owner 的容量按该槽计一次。";
  renderCacheSummary(config, isPlan);
  renderCacheMatrix(config);
}
snapshot.addEventListener("change", renderCache);
byId("cache-comparison").innerHTML = ["b48", "b2", "b4"].map(key => {
  const config = evidence.cache[key];
  const ratio = config.blocks / evidence.cache.b48.blocks;
  return `<tr><th scope="row">${config.label.split(" · ")[1]}</th><td class="number">${integer(config.blocks)}</td>
    <td class="number">${integer(config.unitBytes)} B</td><td class="number">${ratio.toFixed(2)}×</td>
    <td class="number">${config.ttft.toFixed(2)} s</td></tr>`;
}).join("");

const tabs = [...document.querySelectorAll("[role=tab]")];
function showTab(id) {
  for (const tab of tabs) {
    const panel = tab.getAttribute("aria-controls");
    const selected = panel === id;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    byId(panel).hidden = !selected;
  }
}
function renderHash() {
  const id = location.hash.slice(1);
  if (!id) {
    showTab("operators");
    return;
  }
  const target = byId(id);
  const panel = target?.closest("[role=tabpanel]");
  if (panel) {
    showTab(panel.id);
    if (target !== panel) requestAnimationFrame(() => target.scrollIntoView());
  }
}
for (const [index, tab] of tabs.entries()) {
  tab.addEventListener("click", event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const id = tab.getAttribute("aria-controls");
    if (location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
    showTab(id);
  });
  tab.addEventListener("keydown", event => {
    const nextIndex = {
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }[event.key];
    if (nextIndex === undefined) return;
    event.preventDefault();
    tabs[nextIndex].click();
    tabs[nextIndex].focus();
  });
}
window.addEventListener("hashchange", renderHash);
window.addEventListener("popstate", renderHash);
renderHash();
renderProfile("A");
renderCache();
