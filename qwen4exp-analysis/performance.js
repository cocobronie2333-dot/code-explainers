"use strict";

(() => {
  const validation = window.qwenValidation;
  const rows = validation.decode;
  const number = (value, digits = 2) => Number.isFinite(value) ? value.toFixed(digits) : "—";
  const ms = value => Number.isFinite(value) ? number(value) + " ms" : "—";
  const pct = value => Number.isFinite(value) ? number(value * 100) + "%" : "—";
  const escape = value => String(value).replace(/[&<>"']/g, character =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const workload = row => `${row.input_tokens / 1024}K → 128 · C${row.concurrency}`;
  const card = (name, value) => `<div><span>${name}</span><strong>${value}</strong></div>`;
  const prefillAnchor = byId("sim-p-anchor");
  const prefillBudget = byId("sim-p-budget");
  const decodeAnchor = byId("sim-d-anchor");
  const decodeTokens = byId("sim-d-tokens");

  function renderPrefill() {
    const sample = evidence.cache[prefillAnchor.value];
    const budget = prefillBudget.valueAsNumber;
    byId("sim-p-output").innerHTML = card("实测平均 TTFT", number(sample.ttft) + " s") +
      card("首 token SLO 余量", prefillBudget.validity.valid && Number.isFinite(budget)
        ? number(budget - sample.ttft) + " s" : "—");
    byId("sim-p-note").textContent = "余量为预算减实测均值。这个工况固定为 128K 冷请求和单并发，结果只适用于该采样条件。";
  }

  function renderDecode() {
    const row = rows.find(sample => sample.label === decodeAnchor.value);
    if (!row) {
      byId("sim-d-output").innerHTML = card("实测 TPOT", "—") + card("预计生成用时", "—");
      byId("sim-d-note").textContent = validation.status;
      return;
    }
    const tpot = row.d_metrics.tpot_mean_ms ?? row.client_stream_tpot_mean_ms;
    const count = decodeTokens.valueAsNumber;
    const projected = decodeTokens.validity.valid && Number.isFinite(count) ? count * tpot : null;
    byId("sim-d-output").innerHTML = card("实测 TPOT", ms(tpot)) +
      card("预计生成用时", projected === null ? "—" : number(projected / 1000) + " s");
    byId("sim-d-note").textContent = `生成用时 = 首 token 后的 token 数 × 该工况平均 TPOT。锚点为 ${workload(row)}，超出实测输出长度时采用常速外推。`;
  }

  const pSources = Object.entries(evidence.profiles).map(([group, profile]) => ({
    id: "p-" + group,
    label: "114 · Prefill " + group,
    context: `950DT / 128K → 1 / C32 / P rank 0 / ${integer(profile.rows)} 行`,
    kernels: profile.operations,
  }));
  const dSource = validation.profile && {
    id: "d-104",
    label: "104 · Decode",
    context: `950DT / 128K → 128 / C1 / Decode rank 0 / ${integer(validation.profile.kernel_rows)} 行`,
    kernels: validation.profile.top_kernels_by_sum.map(kernel => ({
      name: kernel.type, ms: kernel.sum_device_ms, count: kernel.count,
    })),
  };
  const kernelSources = dSource ? [dSource, ...pSources] : pSources;
  const kernelSource = byId("kernel-source");

  function renderKernels() {
    const selected = kernelSources.find(source => source.id === kernelSource.value);
    const kernels = selected.kernels.slice(0, selected.id === "d-104" ? 15 : 10);
    byId("kernel-context").textContent = selected.context;
    byId("kernel-chart").innerHTML = kernels.map(item => `
      <div class="chart-row"><code>${escape(item.name)}</code>
        <span class="bar-track" aria-hidden="true"><span class="bar-fill" style="width:${100 * item.ms / kernels[0].ms}%"></span></span>
        <span class="chart-time">${ms(item.ms)}</span><span class="chart-count">${integer(item.count)} 次</span>
      </div>`).join("");
  }

  const colors = {
    qsa: ["QSA / Indexer", "var(--lilac)"],
    gdn: ["GDN / 状态更新", "var(--mint)"],
    hc: ["HyperConnection", "var(--gold)"],
    moe: ["MoE / 量化 / 投影", "#9bc2fc"],
    comm: ["通信 / 搬运", "#f3a5a8"],
    other: ["其他", "#a6a9b7"],
  };
  const timelineSource = byId("timeline-source");
  const plot = byId("timeline-plot");
  const detail = byId("timeline-detail");

  function describeEvent(event) {
    detail.textContent = `${event.name} · stream ${event.stream} · 自窗口起 ${number(event.start_us / 1000, 3)} ms · 完整耗时 ${number(event.duration_us, 3)} μs`;
  }

  function renderTimeline() {
    const windowData = validation.windows.find(item => item.id === timelineSource.value);
    if (!windowData) {
      byId("timeline-context").textContent = validation.status;
      byId("pipeline-content").hidden = true;
      return;
    }
    const { events, span_us: span, label, selected } = windowData;
    const used = [...new Set(events.map(event => event.kind))];
    const groups = Map.groupBy ? Map.groupBy(events, event => event.stream) : events.reduce((streams, event) => {
      if (!streams.has(event.stream)) streams.set(event.stream, []);
      streams.get(event.stream).push(event);
      return streams;
    }, new Map());
    byId("timeline-context").textContent = `${label} · ${number(span / 1000, 2)} ms 时间窗 · ${integer(events.length)} 条事件`;
    byId("timeline-legend").innerHTML = used.map(kind =>
      `<span><i style="--tone:${colors[kind][1]}"></i>${colors[kind][0]}</span>`).join("");
    const ticks = Array.from({ length: 5 }, (_, index) =>
      `<span>${number(index * span / 4000, 2)} ms</span>`).join("");
    plot.innerHTML = `<div class="timeline-row"><span>Stream</span><div class="time-ticks">${ticks}</div></div>` +
      [...groups].map(([stream, items]) => `
        <div class="timeline-row"><span>${escape(stream)}</span><div class="timeline-lane">
          ${items.map(event => {
            const left = Math.max(0, event.start_us) * 100 / span;
            const right = Math.min(span, event.start_us + event.duration_us) * 100 / span;
            return `<button type="button" class="timeline-event"
              style="left:${left}%;width:${right - left}%;--tone:${colors[event.kind][1]}"
              data-event="${event.id}" title="${escape(event.name)} · ${number(event.duration_us, 2)} μs"
              aria-label="${escape(event.name)} · stream ${escape(stream)} · ${number(event.duration_us, 2)} μs"></button>`;
          }).join("")}
        </div></div>`).join("");
    const byEvent = new Map(events.map(event => [String(event.id), event]));
    const update = event => {
      const item = byEvent.get(event.target.dataset.event);
      if (item) describeEvent(item);
    };
    plot.onpointerover = update;
    plot.onfocusin = update;
    plot.onclick = update;
    describeEvent(byEvent.get(String(selected)) ?? events[0]);
  }

  function setupOptions(select, options, defaultValue) {
    select.replaceChildren(...options.map(([value, label]) => new Option(label, value)));
    if (defaultValue && options.some(([value]) => value === defaultValue)) select.value = defaultValue;
    select.disabled = options.length === 0;
  }

  setupOptions(decodeAnchor, rows.map(row => [row.label, workload(row)]), "decode-128k-c1");
  decodeTokens.disabled = rows.length === 0;
  prefillAnchor.addEventListener("change", renderPrefill);
  prefillBudget.addEventListener("input", renderPrefill);
  decodeAnchor.addEventListener("change", renderDecode);
  decodeTokens.addEventListener("input", renderDecode);
  byId("decode-context").textContent = validation.context;
  byId("decode-status").textContent = validation.result;
  byId("decode-measurements").innerHTML = rows.length ? rows.map(row => {
    const d = row.d_metrics;
    return `<tr><th scope="row">${workload(row)}</th><td class="number">${row.requests}</td>
      <td class="number">${ms(row.client_ttft_mean_ms)}</td><td class="number">${ms(row.client_stream_tpot_mean_ms)}</td>
      <td class="number">${ms(d.itl_mean_ms)}</td><td class="number">${pct(d.acceptance_rate)}</td>
      <td class="number">${integer(d.accepted_tokens)} / ${integer(d.draft_tokens)}</td></tr>`;
  }).join("") : `<tr><td colspan="7">${escape(validation.status)}</td></tr>`;
  byId("decode-metric-note").textContent = rows.length
    ? "正式跑分先预热前缀，采样期间关闭 profiler。ITL 是引擎输出步间隔的均值，客户端 TPOT 将首段后的流式耗时按输出 token 均摊。MTP 每步可输出多个 token，接受率以接受 token 数除以草稿 token 数。"
    : "已有 114 Prefill 采集可在下方选择。";
  if (validation.resultNote) byId("decode-metric-note").append(" ", validation.resultNote);
  if (validation.notion) {
    const link = document.createElement("a");
    link.href = validation.notion;
    link.textContent = "104 验证记录 ↗";
    byId("decode-metric-note").append(" ", link);
  }
  setupOptions(kernelSource, kernelSources.map(source => [source.id, source.label]));
  kernelSource.addEventListener("change", renderKernels);
  setupOptions(timelineSource, validation.windows.map(item => [item.id, item.label]));
  timelineSource.addEventListener("change", renderTimeline);
  byId("pipeline-paths").innerHTML = `
    <div><dt>QSA</dt><dd>更新索引和 KV → 选择稀疏块 → 执行 Attention。查找 <code>LightningIndexerV2</code>、<code>GenericBlockSparseAttention</code> 及 metadata。</dd></div>
    <div><dt>GDN</dt><dd>卷积状态更新 → gated delta recurrence。Prefill 走 chunk 路径，Decode 按当前步更新历史状态。具体融合路径由运行时决定。</dd></div>
    <div><dt>HyperConnection / MoE</dt><dd>查看 stream 上的 HC gate / combine、门控专家投影及 EP 通信。结合形状和源码定位一次调用属于主模型还是 MTP 草稿。</dd></div>`;
  renderPrefill();
  renderDecode();
  renderKernels();
  renderTimeline();
})();
