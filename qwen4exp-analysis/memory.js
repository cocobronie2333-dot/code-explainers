"use strict";

(() => {
  const form = byId("memory-form");
  const preset = byId("memory-preset");
  const layout = byId("memory-layout");
  const weightMode = byId("memory-weight-mode");
  const weightRows = byId("memory-weight-rows");
  const inputs = ["card-gib", "utilization", "weights-gib", "runtime-gib", "kv-override"];
  const parallelInputs = ["memory-dp", "memory-tp", "memory-ep", "memory-mtp", "memory-vision", "memory-shared", "memory-ple", "memory-etp"];
  const decodeRegistration = { bytes: 11996200960, blocks: 544 };
  const kvOverride = 12014242304 / GIB;
  const presets = {
    a3: { values: [64, 70, 28.66, 4.44, ""], tp: 8, mtp: 0, vision: "tp", layout: "a3",
      note: "A3 · 28.66 GiB 来自加载日志，4.44 GiB 按日志的 11.70 GiB KV 预算反推。1228 blocks 来自规划快照。" },
    pr: { values: [96, 70, 28.66, 4, kvOverride], tp: 8, mtp: 0, vision: "tp", layout: "a3",
      note: "950PR · 28.66 GiB 和 KV 覆盖取自运行日志。卡容量与 4 GiB 预留为可编辑的规划输入。" },
    dt: { values: [96, 70, 57.63, 4, kvOverride], tp: 4, mtp: 5, vision: "off", layout: "dt",
      note: "950DT 104 · 成功 Decode 运行仅加载文本，日志为 57.63 GiB。启用视觉的另一轮日志为 57.78 GiB。4 GiB 预留为估算。" },
  };
  const formatMb = bytes => `${(bytes / 1e6).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MB`;

  // Raw payload bytes from the 61 Safetensors headers. Preserve each stored dtype.
  const checkpoint = {
    embedding: 2542796800, gdn: { tp: 8346023424, replicated: 18432 },
    qsa: { tp: 567410688, kv: 31555584, replicated: 270336 }, indexer: 19734528,
    routed: 121550929920, shared: 943718400, router: 252149760, hc: 2549370880,
    pleTable: 102400491520, ple: 65679430,
    mtp: { tp: 120586240, replicated: 45477376, routed: 5033164800, shared: 9830400, kv: 5242880 },
    vision: { tp: 888629472, replicated: 9232640 },
  };
  const checkpointBytes = 245382313510;

  function estimateWeights({ tp, ep, etp, mtp, vision, shared, ple }) {
    const c = checkpoint;
    const kvShards = Math.min(tp, 2);
    const localExperts = Math.ceil(512 / ep);
    const routedFraction = ep > 1 ? localExperts / 512 : 1 / tp;
    const sharedShards = shared === "replica" ? 1 : tp;
    const draft = c.mtp;
    const draftBytes = draft.tp / tp + draft.kv / kvShards + draft.routed * routedFraction + draft.shared / sharedShards + draft.replicated;
    const visionBytes = vision === "replica" ? c.vision.tp + c.vision.replicated : c.vision.tp / tp + c.vision.replicated;
    return [
      ["Embedding / LM Head", "BF16", c.embedding / tp, `两份独立词表矩阵，各为 [248320,2560]，按 TP${tp} 切分。MTP 共享词嵌入与输出头。`],
      ["GDN Attention ×36", "FP32", c.gdn.tp / tp + c.gdn.replicated, `按 checkpoint 的 FP32 存储估算。QKV、Z、衰减、短卷积及输出投影按 TP${tp} 分片，头内归一化复制。`],
      ["QSA Attention ×12", "INT8 + FP32", c.qsa.tp / tp + c.qsa.kv / kvShards + c.qsa.replicated, `Q 与 O 投影矩阵按 TP${tp} 分片。K/V 只有 2 个全局头，按 ${kvShards} 份切分。TP 大于 2 时复制 K/V。含 weight scale、offset、归一化。`],
      ["QSA Indexer ×12", "INT8 + FP32", c.indexer, "Index Q/K 投影与归一化在 TP 内复制。含 weight scale 和 offset。"],
      ["路由专家 ×48", "INT8 + FP32", c.routed * routedFraction, ep > 1 ? `512 个专家分布到 EP${ep}，按最多 ${localExperts} 个专家的 rank 预算。含 Gate/Up/Down 的 scale 与 offset。` : `EP 关闭。每 rank 包含全部 512 个专家的 TP${tp} 分片。`],
      ["共享专家 ×48", "FP32", c.shared / sharedShards, sharedShards === 1 ? "每 rank 加载完整共享专家权重。" : `Gate/Up/Down 按 TP${sharedShards} 分片。`],
      ["MoE Router ×48", "FP32", c.router, "每 rank 复制路由与共享专家门控参数。每 token 选 10 个专家，驻留按全部专家计算。"],
      ["Norm / HC", "BF16 + FP32", c.hc, "按 checkpoint 字节估算注意力前、MoE 前及末层 HC。按 rank 复制，运行时 dtype、合并和行对齐以加载日志为准。"],
      ["PLE n-gram 表 · L1", "BF16", ple === "host" ? 0 : c.pleTable / etp, `128 个词表 shard，各为 [2500012,160]。按 ETP${etp} 分片，每 rank 约 ${gib(c.pleTable / etp)}，放在${ple === "host" ? " host 侧" : " HBM"}。`],
      ["PLE 投影与短卷积 · L1", "BF16", c.ple, "单独计入复制的投影、短卷积和归一化参数。Host offload 仅移动 n-gram 表。"],
      ["MTP · L48", "BF16", mtp ? draftBytes : 0, `启用时加载 1 层。草稿专家沿用路由专家分配，Q/O 与融合投影走 TP${tp}，K/V 采用 ${kvShards} 份。${mtp ? `本配置每轮最多提议 ${mtp} 个 token。` : "本配置关闭。"}`],
      ["视觉编码器 ×27", "BF16", vision === "off" ? 0 : visionBytes, vision === "off" ? "纯文本预设跳过视觉权重。" : vision === "replica" ? "全部视觉权重按每 rank 复制。" : `注意力和 MLP 投影估算按 TP${tp} 分片，位置编码、patch embedding 和归一化等保留副本。`],
    ];
  }

  function renderWeightRows(rows, estimate, weights, settings, comparable) {
    const open = new Set([...weightRows.querySelectorAll("details[open]")].map(row => row.dataset.group));
    weightRows.innerHTML = rows.map(([name, dtype, bytes, rule], index) => `
      <details data-group="${index}" ${open.has(String(index)) ? "open" : ""}>
        <summary><span>${name}</span><span class="weight-dtype">${dtype}</span><strong>${formatMb(bytes)}</strong></summary>
        <p>${rule}</p>
      </details>`).join("");
    const total = `分项合计 ${gib(estimate)} / rank。`;
    const delta = comparable && weightMode.value === "log"
      ? `与日志 / 手填值之差 ${(weights - estimate / GIB).toFixed(2)} GiB（加载值 − 分项）。` : "";
    const host = settings.ple === "host" ? `Host n-gram 表约 ${gib(checkpoint.pleTable / settings.etp)} / rank。` : "";
    byId("weight-breakdown-note").textContent = `${total}${delta}${host} 估算沿用盘上 dtype，运行时转换与打包以加载日志为准。`;
  }

  function renderKvDetails(config, cost, blocks, remainder) {
    const details = [];
    let note = "根据当前拓扑的实际布局填写每 block 字节数。";
    if (config) {
      details.push(["QSA / 状态组 block size", `${config.groups[1].blockSize} tokens`],
        ["QSA raw ring block size", `${config.groups[0].blockSize} tokens`],
        ["调度组 / 物理布局", `${config.groups.length} / ${config.layout}`],
        ["Packed backing / ID", `${integer(config.packedBytes / config.blocks)} B`],
        ["独立 PLE backing / ID", `${integer((config.bytes - config.packedBytes) / config.blocks)} B`]);
      note = config.pleSeparate
        ? "Packed backing 每 ID 含 12 × (786,432 B 主 KV + 1,120 B raw + 49,152 B 压缩索引)。GDN 与 QSA 主 KV 共用地址，PLE 额外分配 184,320 B / ID。"
        : "Packed backing 已包含 PLE 和可复用的轮转槽。共享槽按物理存储计一次。";
    } else if (layout.value === "dt") {
      details.push(["启动参数 block_size", "768 tokens"], ["QSA / 状态组 block size", "1,536 tokens"], ["QSA raw ring block size", "12 tokens"],
        ["实机注册区域", "2 个"], ["注册容量 / rank", `${integer(decodeRegistration.bytes)} B`]);
      note = "104 成功 Decode 日志记录 2 个 Mooncake 设备端区域、544 个 block ID。在该拓扑下用注册字节数除以 ID 数校准每块成本。";
    }
    if (cost !== null) details.push(["每个 ID 的物理成本", `${integer(cost)} B`],
      ["按整块分配", formatMb(blocks * cost)], ["未形成整块的余量", formatMb(remainder)]);
    byId("budget-blocks").textContent = blocks === null ? "—" : integer(blocks);
    byId("memory-kv-rows").innerHTML = details.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");
    byId("memory-kv-foot").textContent = note;
    const specList = byId("memory-kv-specs");
    specList.hidden = !config;
    if (config) {
      const [raw, qsa, gdn, , , ple] = config.groups;
      const specs = [["主 K / V", qsa.members.find(item => item.owner.endsWith(".attn"))],
        ["Raw ring", raw.members[0]], ["压缩索引", qsa.members.find(item => item.owner.endsWith(".compressed_key_cache"))],
        ["GDN conv / state", gdn.members[0]], ["PLE short-conv", ple.members[0]]];
      specList.innerHTML = specs.map(([label, member]) => {
        const shapes = member.shapes.map((shape, i) => `${tensorShape(shape)} ${cacheDtypes[member.dtypes[i]].label}`);
        const summary = shapes.every(shape => shape === shapes[0]) && shapes.length > 1 ? `${shapes.length}×${shapes[0]}` : shapes.join(" + ");
        return `<div><dt>${label}</dt><dd>${summary}</dd></div>`;
      }).join("");
    }
  }

  function renderBudget(event) {
    const current = presets[preset.value];
    const [dpText, tpText, expert, draft, vision, shared, ple, etpMode] = parallelInputs.map(id => byId(id).value);
    const dp = Number(dpText);
    const tp = Number(tpText);
    const mtp = Number(draft);
    const ranks = dp * tp;
    const ep = expert === "on" ? ranks : 1;
    const settings = { tp, ep, mtp, vision, shared, ple, etp: etpMode === "world" ? ranks : tp };
    const validRanks = byId("memory-dp").validity.valid && dp >= 1;
    const matchesPreset = dp === 1 && tp === current.tp && expert === "on" && mtp === current.mtp &&
      vision === current.vision && shared === "shard" && ple === "device" && etpMode === "tp";
    if (event && parallelInputs.includes(event.target.id) && !matchesPreset) weightMode.value = "checkpoint";
    byId("memory-weight-field").hidden = weightMode.value === "checkpoint";
    for (const option of layout.options) {
      option.disabled = option.value === "dt" ? tp !== 4 || mtp !== 5
        : option.value !== "custom" && (tp !== 8 || mtp !== 0);
    }
    if (layout.selectedOptions[0].disabled) layout.value = "custom";
    const custom = layout.value === "custom";
    byId("custom-layout-field").hidden = !custom;
    const config = evidence.cache[layout.value === "a3" && preset.value !== "a3" ? "b48" : layout.value];
    const manualCost = byId("custom-layout");
    const cost = custom ? (manualCost.value ? manualCost.valueAsNumber : null)
      : layout.value === "dt" ? decodeRegistration.bytes / decodeRegistration.blocks : config.unitBytes;
    const [card, utilization, loaded, reserved, override] = inputs.map(id => byId(id).valueAsNumber);
    const hasOverride = byId("kv-override").value !== "";
    const invalidCapacity = inputs.some((id, i) => {
      const field = byId(id);
      if (i === 4 && !hasOverride) return field.validity.badInput;
      if (i === 2 && weightMode.value === "checkpoint") return false;
      return !field.validity.valid || !Number.isFinite(field.valueAsNumber);
    }) || custom && !manualCost.validity.valid;

    const budgetNote = byId("budget-note");
    if (!validRanks || invalidCapacity) {
      for (const id of ["budget-weights", "budget-kv", "budget-ranks", "budget-blocks"]) byId(id).textContent = "—";
      for (const id of ["budget-weight-note", "budget-kv-note", "budget-parallel-note", "budget-capacity", "budget-bar", "budget-ledger",
        "budget-formula", "memory-weight-rows", "weight-breakdown-note", "memory-kv-rows", "memory-kv-foot", "memory-kv-specs"]) byId(id).replaceChildren();
      budgetNote.classList.add("warning");
      budgetNote.hidden = false;
      budgetNote.textContent = validRanks ? "请填写有效的容量、利用率与每 block 成本。" : "DP size 需要填写 1 到 512 的整数。";
      return;
    }

    const rows = estimateWeights(settings);
    const estimate = rows.reduce((sum, [, , bytes]) => sum + bytes, 0);
    const checkpointMode = weightMode.value === "checkpoint";
    const weights = checkpointMode ? estimate / GIB : loaded;
    const cap = card * utilization / 100;
    const free = cap - weights - reserved;
    const kvBytes = Math.round((hasOverride ? override : Math.max(0, free)) * GIB);
    const blocks = cost === null ? null : Math.floor(kvBytes / cost);
    const allocated = blocks === null ? kvBytes : blocks * cost;
    const remainder = kvBytes - allocated;
    const totalDemand = weights + reserved + kvBytes / GIB;
    const expectedBlocks = config?.blocks ?? (layout.value === "dt" ? decodeRegistration.blocks : null);

    byId("budget-weights").textContent = gib(weights * GIB);
    byId("budget-weight-note").textContent = `${formatMb(weights * GIB)} · ${checkpointMode ? "checkpoint 估算" : matchesPreset && loaded === current.values[2] ? "加载日志" : "手动预算值"}`;
    byId("budget-kv").textContent = gib(allocated);
    byId("budget-kv-note").textContent = blocks === null ? "原始预算 · 待填每块成本" : `${integer(blocks)} IDs / rank · 按整块向下取整`;
    byId("budget-ranks").textContent = `${integer(ranks)} ranks`;
    const specialists = 512 % ep ? `${Math.floor(512 / ep)}–${Math.ceil(512 / ep)}` : integer(512 / ep);
    byId("budget-parallel-note").textContent = `DP${dp} × TP${tp} · EP${ep} · ${ep > 1 ? `${specialists} 个专家 / rank` : `全部专家按 TP${tp} 分片`}`;
    byId("budget-capacity").textContent = `${gib(card * GIB)} HBM · ${utilization}% 预算`;

    const ledger = [
      ["模型加载", weights, "#d5ac6e"], ["运行时预留", reserved, "#739bb8"],
      [blocks === null ? "待换算 KV 预算" : "整块 KV cache", allocated / GIB, "#40cbbd"],
      ["未凑整块", remainder / GIB, "#a6b895"], ["利用率预算内剩余", Math.max(0, cap - totalDemand), "#405667"],
      ["利用率预算外", Math.max(0, card - Math.max(totalDemand, cap)), "#263d4f"],
    ];
    byId("budget-bar").innerHTML = ledger.map(([label, value, color]) =>
      `<span class="budget-segment" style="width:${value / Math.max(card, totalDemand) * 100}%;--tone:${color}" title="${label} ${gib(value * GIB)}"></span>`).join("");
    byId("budget-ledger").innerHTML = ledger.map(([label, value, color], index) =>
      `<div><dt><i class="budget-key" style="--tone:${color}"></i>${label}</dt><dd>${index === 3 ? formatMb(remainder) : gib(value * GIB)}</dd></div>`).join("");
    byId("budget-formula").textContent = hasOverride
      ? `KV 预算按覆盖值 ${gib(kvBytes)} 计算。未覆盖时，${card} GiB × ${utilization}% − ${weights.toFixed(2)} GiB − ${reserved.toFixed(2)} GiB = ${gib(Math.max(0, free) * GIB)}。`
      : `KV 预算 = max(0, ${card} GiB × ${utilization}% − ${weights.toFixed(2)} GiB − ${reserved.toFixed(2)} GiB) = ${gib(kvBytes)}。`;

    renderWeightRows(rows, estimate, weights, settings, matchesPreset);
    renderKvDetails(config, cost, blocks, remainder);
    const notes = [];
    if (totalDemand > card) notes.push(`超出 HBM ${gib((totalDemand - card) * GIB)}。分配条按需求总量绘制。`);
    if (totalDemand > cap + 0.00001) notes.push(`超出利用率预算 ${gib((totalDemand - cap) * GIB)}。${hasOverride ? "显式 KV 覆盖独立于利用率。" : ""}`);
    budgetNote.classList.toggle("warning", notes.length > 0);
    if (cost === null) notes.push("当前配置需要匹配拓扑的每 block 成本才能计算容量。");
    else if (blocks === expectedBlocks) notes.push(`与${config === evidence.cache.a3 ? "A3 规划" : "实机"}样本的 ${integer(blocks)} blocks 一致。`);
    else if (expectedBlocks) notes.push(`布局参考样本为 ${integer(expectedBlocks)} blocks，当前结果按输入预算计算。`);
    budgetNote.textContent = notes.join(" ");
    budgetNote.hidden = notes.length === 0;
  }

  function applyPreset() {
    const current = presets[preset.value];
    const parallel = [1, current.tp, "on", current.mtp, current.vision, "shard", "device", "tp"];
    parallelInputs.forEach((id, index) => { byId(id).value = parallel[index]; });
    inputs.forEach((id, index) => { byId(id).value = current.values[index]; });
    byId("custom-layout").value = "";
    weightMode.value = "log";
    layout.value = current.layout;
    byId("preset-note").textContent = current.note;
    renderBudget();
  }

  byId("checkpoint-facts").innerHTML = `104 上只读取 Safetensors 头部。${integer(evidence.checkpoint.files)} 个文件共 ${gib(evidence.checkpoint.fileBytes)}，张量数据 ${integer(checkpointBytes)} B。文件头开销 ${integer(evidence.checkpoint.fileBytes - checkpointBytes)} B。 <a href="${cacheSource}">缓存验证记录 ↗</a>`;
  preset.addEventListener("change", applyPreset);
  byId("reset-memory").addEventListener("click", applyPreset);
  form.addEventListener("input", renderBudget);
  form.addEventListener("submit", event => event.preventDefault());
  applyPreset();
})();
