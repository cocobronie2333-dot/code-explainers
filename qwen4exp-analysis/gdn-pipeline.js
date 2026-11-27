"use strict";

(() => {
  const { tokens, layers } = window.qwenGdnPipeline;
  const source = window.qwenValidation.windows.find(item => item.id === "d-gdn");
  const origin = source.events.find(event => event.name === "CausalConv1d").start_us;
  const decode = source.events.filter(event => event.start_us >= origin).map(event => ({
    name: event.name, profiler_type: event.name, stream: event.stream,
    start_us: event.start_us - origin, duration_us: event.duration_us,
  }));
  const phase = byId("gdn-phase");
  const layer = byId("gdn-layer");
  const layerGrid = byId("gdn-layer-grid");
  const chart = byId("gdn-chart");
  const calls = byId("gdn-calls");
  const pmu = byId("gdn-pmu");
  const format = (value, digits = 2) => value.toFixed(digits);
  const layerName = number => "L" + String(number).padStart(2, "0");
  const escape = value => String(value).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const tone = name => /ChunkGated|Recurrent/.test(name) ? "var(--mint)"
    : /gating/.test(name) ? "var(--gold)" : name === "CausalConv1d" ? "var(--lilac)" : "#8fa6bd";
  const peakLayer = Math.max(...layers.map(item => item.mean_span_us));
  let activeEvents;

  for (const item of layers) layer.add(new Option(layerName(item.layer), item.layer));
  layerGrid.innerHTML = layers.map(item => `
    <button type="button" data-layer="${item.layer}" style="--fill:${100 * item.mean_span_us / peakLayer}%">
      <span>${layerName(item.layer)}</span><strong>${format(item.mean_span_us, 0)}</strong>
    </button>`).join("");

  function pickEvent(index) {
    const item = activeEvents[index];
    for (const element of document.querySelectorAll("#gdn-chart [data-call], #gdn-calls [data-call]")) {
      element.setAttribute("aria-pressed", String(Number(element.dataset.call) === index));
    }
    pmu.innerHTML = `<p><code>${escape(item.profiler_type)}</code></p>
      <p>Stream ${escape(item.stream)}${item.core ? " · " + escape(item.core) : ""} · 单次 ${format(item.duration_us, 3)} μs</p>
      ${item.pmu_us ? `<dl class="gdn-counters">${Object.entries(item.pmu_us).map(([name, value]) => `
        <div><dt>${name}</dt><dd>${value === null ? "—" : format(value, 3) + " μs"}</dd>
        <span aria-hidden="true" style="--fill:${Math.min(100, 100 * (value ?? 0) / item.duration_us)}%"></span></div>`).join("")}</dl>
        <p class="muted">计数来自同一 Stream、Task ID 与设备时间。AIC/AIV 同名计数取较大值。各流水线可重叠。</p>`
        : '<p class="muted">此 Decode 窗口只有设备事件时间，暂无该次调用的 PMU 明细。</p>'}`;
  }

  function renderTimeline(events) {
    const lane = event => event.core || `Stream ${event.stream}`;
    const lanes = [...new Set(events.map(lane))];
    const origin = 112;
    const timelineWidth = 840;
    const span = Math.max(...events.map(item => item.start_us + item.duration_us));
    const end = Math.ceil(span / 100) * 100;
    const x = value => origin + value / end * timelineWidth;
    const height = 50 + lanes.length * 40;
    chart.innerHTML = `<svg viewBox="0 0 970 ${height}" class="gdn-chart" aria-label="单次采样的实际设备时间轴">
      ${Array.from({ length: 6 }, (_, index) => {
        const tick = index * end / 5;
        return `<text x="${x(tick)}" y="16" text-anchor="middle">${format(tick, 0)} μs</text>
          <path d="M${x(tick)} 25V${height - 11}" class="sim-gridline"/>`;
      }).join("")}
      ${lanes.map((label, index) => `<text x="5" y="${50 + index * 40}">${escape(label)}</text>
        <path d="M${origin} ${61 + index * 40}H${origin + timelineWidth}" class="sim-gridline"/>`).join("")}
      ${events.map((item, index) => {
        const y = 34 + lanes.indexOf(lane(item)) * 40;
        return `<rect data-call="${index}" role="button" tabindex="0" aria-label="${escape(item.name)} · ${format(item.duration_us)} μs"
          x="${x(item.start_us)}" y="${y}" width="${Math.max(2, item.duration_us / end * timelineWidth)}" height="23" rx="3"
          fill="${tone(item.name)}"><title>${escape(item.name)} · ${format(item.duration_us)} μs</title></rect>`;
      }).join("")}</svg>`;
  }

  function render() {
    const isPrefill = phase.value === "prefill";
    const item = layers.find(candidate => candidate.layer === Number(layer.value));
    const events = isPrefill ? item.events : decode;
    activeEvents = events;
    byId("gdn-layer-controls").hidden = !isPrefill;
    for (const button of layerGrid.querySelectorAll("button")) {
      button.setAttribute("aria-pressed", String(button.dataset.layer === layer.value));
    }
    byId("gdn-context").textContent = isPrefill
      ? `950DT · TP4 / EP4 · rank 0 · 每个 Prefill 核心调用 ${integer(tokens)} tokens · 35 层有匹配标记`
      : "950DT · TP4 / EP4 · rank 0 · 128K Decode · MTP5 · 局部窗口";
    const stats = isPrefill ? [
      ["层号", layerName(item.layer)], ["采样数", item.samples],
      ["平均设备跨时", format(item.mean_span_us) + " μs"], ["平均 kernel 累计", format(item.mean_sum_us) + " μs"],
    ] : [["记录", "局部路径"], ["可见调用", events.length],
      ["首末事件跨时", format(events.at(-1).start_us + events.at(-1).duration_us) + " μs"]];
    byId("gdn-summary").innerHTML = stats.map(([name, val]) => `<div><span>${name}</span><strong>${val}</strong></div>`).join("");
    byId("gdn-footnote").textContent = isPrefill
      ? "层号通过 CPU GDN scope 内的层标记核对。L01 缺少可配对的标记。图中是该层第一条设备样本，跨时从短卷积开始至最后一次 Transpose 结束，包含间隙。此边界只覆盖 GDN 核心，投影、HC 与 MoE 在核心之外。"
      : "可核实的边界为短卷积至窗口末尾的归一化事件。该窗口没有逐层标记，因此保留局部时序和实际间隙。";
    renderTimeline(events);
    calls.innerHTML = `<div class="table-scroll"><table class="gdn-table"><thead><tr>
      <th scope="col">事件</th><th scope="col">Stream</th><th scope="col">开始 · μs</th><th scope="col">耗时 · μs</th></tr></thead>
      <tbody>${events.map((event, index) => `<tr><th scope="row"><button class="gdn-call" type="button" data-call="${index}">
        <i style="--tone:${tone(event.name)}"></i>${escape(event.name)}</button></th><td>${escape(event.stream)}</td>
        <td>${format(event.start_us, 3)}</td><td>${format(event.duration_us, 3)}</td></tr>`).join("")}</tbody></table></div>`;
    pickEvent(events.findIndex(event => /ChunkGatedDeltaRuleFwd|RecurrentGatedDeltaRule/.test(event.name)));
  }

  phase.addEventListener("change", render);
  layer.addEventListener("change", render);
  layerGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-layer]");
    if (!button) return;
    layer.value = button.dataset.layer;
    render();
  });
  function select(event) {
    const target = event.target.closest("[data-call]");
    if (target) pickEvent(Number(target.dataset.call));
  }
  calls.addEventListener("click", select);
  chart.addEventListener("click", select);
  chart.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    select(event);
  });
  byId("gdn-download").href = URL.createObjectURL(new Blob([JSON.stringify(
    { prefill: window.qwenGdnPipeline, decode: { scope: "rank0 local window", events: decode } }, null, 2
  )], { type: "application/json" }));
  render();
})();
