"use strict";

(() => {
  const field = name => byId("sim-" + name);
  const form = field("form");
  const dialog = field("dialog");
  const sweep = window.qwenDecodeSweep;
  const referenceInput = 131072;
  const referenceOutput = 96;
  const kvAlignment = 768;
  const prefillChunk = 1536;
  const dtCapacity = 624286;
  const dtBlocks = 544;
  const pProfiles = window.qwenEvidence.cache;
  const matched = (perf, verified) => perf.filter(row =>
    verified.some(trace => trace.batch === row.batch && trace.submitted_batch === row.batch));
  const independentDecode = input => window.qwenValidation.decode
    .filter(row => row.input_tokens === input && row.concurrency === 1)
    .map(row => ({ batch: 1, itl_mean_ms: row.d_metrics.itl_mean_ms, tpot_mean_ms: row.client_stream_tpot_mean_ms }));
  const dProfiles = {
    dt: { label: "950DT · TP4 / EP4 · MTP5", rows: matched(sweep.perf, sweep.verified), mtp: true, capacity: dtCapacity },
    a3: { label: "A3 · TP8 / EP8 · MTP5", rows: matched(sweep.a3.perf, sweep.a3.verified), mtp: true },
    noMtp: { label: "950DT · TP4 / EP4 · MTP 关闭", rows: matched(sweep.comparison.perf, sweep.comparison.verified), mtp: false },
    dt8: { label: "950DT · TP4 / EP4 · 独立 D · MTP5", rows: independentDecode(8192), mtp: true, capacity: dtCapacity, input: 8192, output: 128 },
    dt128: { label: "950DT · TP4 / EP4 · 独立 D · MTP5", rows: independentDecode(referenceInput), mtp: true, capacity: dtCapacity, input: referenceInput, output: 128 },
  };
  const metricNames = { ttft: "TTFT", itl: "ITL", tpot: "TPOT" };
  const sampleNotes = { anchor: "实测锚点", adjusted: "锚点调整", model: "线性估算", interpolated: "档间插值", extended: "末档持平外推" };
  const fmt = (value, digits = 2) => value.toLocaleString("en-US", {
    minimumFractionDigits: digits, maximumFractionDigits: digits,
  });
  const speed = value => fmt(value, value < 0.01 ? 4 : 2);
  const seconds = value => fmt(value, value < 0.0001 ? 8 : 4);
  const value = name => field(name).valueAsNumber;
  const optional = name => field(name).value === "" ? null : value(name);
  const batches = cap => Array.from({ length: cap }, (_, index) => index + 1);
  const valid = names => names.every(name => field(name).validity.valid);

  function linkedBudget(side, layout, preset) {
    if (field(side + "-budget-source").value === "reference") return null;
    if (!layout) return { error: "第 3 页暂无对应的 Decode 布局，请选择部署参考值并填写实际 KV 容量。" };
    const budget = window.qwenRankBudgets.get(`${preset}/${layout}`);
    const tp = side === "p" ? 8 : 4;
    const mtp = side === "p" ? 0 : 5;
    if (!budget || !Number.isFinite(budget.blocks) || budget.dp !== 1 || budget.tp !== tp ||
        budget.ep !== tp || budget.mtp !== mtp || budget.etp !== tp || budget.shared !== "shard" ||
        budget.ple !== "device" || budget.vision !== (side === "p" ? "tp" : "off")) {
      const name = side === "p" ? `950PR / ${field("p-profile").value.toUpperCase()}` : "950DT / MTP5";
      return { error: `请在第 3 页选择 ${name} 匹配布局及 DP1 / TP${tp} / EP${tp} 单副本。` };
    }
    return budget;
  }

  function scanBatches(cap, fixed) {
    return fixed ? [fixed] : batches(cap);
  }

  function memoryPass(budget, bytes) {
    if (!budget) return true;
    const base = budget.weights + budget.reserved;
    return base + budget.blocks * budget.cost / GIB <= budget.card + 1e-9 &&
      base + bytes / GIB <= Math.min(budget.cap, budget.card) + 1e-9;
  }

  function scanPrefill(input, budget) {
    const profile = pProfiles[field("p-profile").value];
    const replicas = value("p-replicas");
    const cap = value("p-batch");
    const fixed = value("p-fixed");
    const capacity = budget?.blocks ?? profile.blocks;
    const uncached = input - Math.floor(input * value("p-prefix") / 100);
    const limits = { ttft: value("ttft") };
    const candidates = scanBatches(cap, fixed).map(batch => {
      const ttft = profile.ttft * Math.max(prefillChunk, batch * uncached) / referenceInput;
      const kv = 1 + batch * (Math.ceil((input + 1) / profile.alignment) + 9);
      const source = batch === 1 && input === referenceInput && uncached === input ? "anchor" : "model";
      const bytes = kv * profile.unitBytes;
      const hbmPass = memoryPass(budget, bytes);
      return { batch, ttft, qps: replicas * batch / ttft, kv, bytes, source, hbmPass, pass: kv <= capacity && hbmPass && ttft <= limits.ttft };
    });
    return {
      candidates, limits, replicas, tokens: input, uncached, budget,
      profile: `${profile.label} · TP8 / EP8`,
      capacity, kvUnit: "IDs", kvBytes: budget ? budget.blocks * budget.cost : profile.bytes,
      anchor: `128K 冷请求 · B1 · 平均 TTFT ${seconds(profile.ttft)} s`,
    };
  }

  function latencyAt(rows, batch, key) {
    const high = rows.findIndex(row => row.batch >= batch);
    if (high < 0) return rows.at(-1)[key];
    const upper = rows[high];
    if (upper.batch === batch || high === 0) return upper[key];
    const lower = rows[high - 1];
    return lower[key] + (upper[key] - lower[key]) * (batch - lower.batch) / (upper.batch - lower.batch);
  }

  function scanDecode(input, output, profile, budget, cap) {
    const replicas = value("d-replicas");
    const requested = value("d-batch");
    const measuredMax = profile.rows.at(-1).batch;
    const fixed = value("d-fixed");
    const manualCapacity = optional("d-capacity");
    const capacity = budget ? Math.min(manualCapacity ?? Infinity, Math.floor(budget.blocks * dtCapacity / dtBlocks))
      : manualCapacity ?? profile.capacity;
    const constraint = field("d-constraint").value;
    const limits = {};
    if (constraint !== "tpot") limits.itl = value("itl");
    if (constraint !== "itl") limits.tpot = value("tpot");
    const generated = output - 1;
    const yieldOverride = profile.mtp ? optional("yield") : null;
    const share = value("d-prefix") / 100;
    const contextFraction = value("d-context") / 100;
    const contextScale = 1 + contextFraction *
      ((input + generated / 2) / ((profile.input ?? referenceInput) + ((profile.output ?? referenceOutput) - 1) / 2) - 1);
    const alignment = profile.capacity ? 1536 : kvAlignment;
    const sharedTokens = Math.floor(input * share / alignment) * alignment;
    const alignedLength = Math.ceil((input + output) / alignment) * alignment;
    const adjusted = yieldOverride !== null || input !== (profile.input ?? referenceInput) || output !== (profile.output ?? referenceOutput);
    const candidates = scanBatches(cap, fixed).map(batch => {
      const itl = contextScale * latencyAt(profile.rows, batch, "itl_mean_ms") / 1000;
      const tpot = yieldOverride === null
        ? contextScale * latencyAt(profile.rows, batch, "tpot_mean_ms") / 1000
        : itl / yieldOverride;
      const kv = batch * alignedLength - (batch - 1) * sharedTokens;
      const source = batch > measuredMax ? "extended"
        : profile.rows.some(row => row.batch === batch)
          ? adjusted ? "adjusted" : "anchor"
          : "interpolated";
      const bytes = budget ? Math.ceil(kv * dtBlocks / dtCapacity) * budget.cost : null;
      const hbmPass = memoryPass(budget, bytes);
      const pass = itl <= (limits.itl ?? Infinity) && tpot <= (limits.tpot ?? Infinity) &&
        (capacity === undefined || kv <= capacity) && hbmPass;
      return { batch, itl, tpot, qps: replicas * batch / (generated * tpot), kv, bytes, source, pass, hbmPass };
    });
    let anchor = `${(profile.input ?? referenceInput) / 1024}K 热前缀 → ${profile.output ?? referenceOutput} · 锚点 B${profile.rows.map(row => row.batch).join(" / ")}`;
    if (cap < requested) anchor += ` · 扫描限至 B${cap}`;
    return { candidates, limits, replicas, tokens: generated, profile: profile.label, capacity, kvUnit: "tokens", anchor, budget };
  }

  function chart(scan, best, phase) {
    const metrics = Object.keys(scan.limits);
    const multiple = metrics.length > 1;
    const yValue = (point, key) => multiple ? point[key] / scan.limits[key] : point[key];
    const threshold = multiple ? 1 : scan.limits[metrics[0]];
    const peak = Math.max(threshold, ...scan.candidates.flatMap(point => metrics.map(key => yValue(point, key))));
    const top = peak * 1.12;
    const first = scan.candidates[0].batch;
    const last = scan.candidates.at(-1).batch;
    const x = point => last === first ? 248 : 56 + (point.batch - first) * 384 / (last - first);
    const y = number => 136 - number * 111 / top;
    const axis = number => multiple ? fmt(number * 100, 0) + "%" : fmt(number, number < 1 ? 2 : 1) + " s";
    const ticks = [...new Set([0, .25, .5, .75, 1].map(fraction => Math.round(first + fraction * (last - first))))];
    return `<svg class="sim-chart" viewBox="0 0 460 173" role="img" aria-label="${phase} Batch 与时延约束曲线">
      ${[0, peak / 2, peak].map(tick => `<path class="sim-gridline" d="M56 ${y(tick)}H440"/><text x="48" y="${y(tick) + 4}" text-anchor="end">${axis(tick)}</text>`).join("")}
      <path class="sim-slo" d="M56 ${y(threshold)}H440"/>
      ${best ? `<path class="sim-selected-line" d="M${x(best)} 25V136"/>` : ""}
      ${ticks.map(batch => `<text x="${x({ batch })}" y="151" text-anchor="middle">${batch}</text>`).join("")}
      <text x="248" y="169" text-anchor="middle">Batch / DP${multiple ? " · 时延 / 各自上限" : ""}</text>
      ${metrics.map((key, index) => `<g class="sim-series-${index}">
        <polyline points="${scan.candidates.map(point => `${x(point)},${y(yValue(point, key))}`).join(" ")}"/>
        ${scan.candidates.map(point => `<circle class="${point.source === "anchor" ? "sim-anchor" : ""} ${point === best ? "sim-best-point" : ""}" cx="${x(point)}" cy="${y(yValue(point, key))}" r="${point === best ? 4.5 : 2.7}"><title>B${point.batch} · ${metricNames[key]} ${seconds(point[key])} s · ${sampleNotes[point.source]}</title></circle>`).join("")}</g>`).join("")}
    </svg><div class="sim-legend">
      ${metrics.map((key, index) => `<span class="sim-key sim-key-${index}">${metricNames[key]}</span>`).join("")}
      <span class="sim-key sim-key-slo">${multiple ? "100% 各自上限" : `${metricNames[metrics[0]]} 上限 ${seconds(threshold)} s`}</span>
      <span class="sim-key sim-key-anchor">实测锚点</span>
      <span class="sim-key sim-key-best">最优档</span>
    </div>`;
  }

  function outcome(point, scan) {
    if (point.pass) return "可行";
    const blocked = Object.keys(scan.limits).filter(key => point[key] > scan.limits[key]).map(key => metricNames[key]);
    if (scan.capacity !== undefined && point.kv > scan.capacity) blocked.push("KV 容量");
    if (!point.hbmPass) blocked.push("HBM 预算");
    return blocked.join(" / ") + " 超限";
  }

  function candidateTable(scan, rows, best, full = false) {
    const metrics = scan.kvUnit === "IDs" ? ["ttft"] : ["itl", "tpot"];
    return `<div class="table-scroll"><table class="sim-table">
      <thead><tr><th scope="col">Batch / DP</th><th scope="col">req/s</th>
      ${metrics.map(key => `<th scope="col">${metricNames[key]} · s</th>`).join("")}
      ${full ? `<th scope="col">KV · ${scan.kvUnit}</th>${scan.budget ? '<th scope="col">HBM 需求 · GiB</th>' : ""}<th scope="col">约束</th>` : ""}<th scope="col">时延口径</th></tr></thead>
      <tbody>${rows.map(point => `<tr class="${point === best ? "sim-best-row" : ""}">
        <th scope="row">${point === best ? "★ " : ""}B${point.batch}</th><td>${point.pass ? speed(point.qps) : "—"}</td>
        ${metrics.map(key => `<td>${seconds(point[key])}</td>`).join("")}
        ${full ? `<td>${fmt(point.kv, 0)}</td>${scan.budget ? `<td>${fmt(scan.budget.weights + scan.budget.reserved + point.bytes / GIB)}</td>` : ""}<td>${outcome(point, scan)}</td>` : ""}
        <td>${sampleNotes[point.source]}</td></tr>`).join("")}</tbody>
      </table></div>`;
  }

  function renderResult(side, scan, empty) {
    const phase = side === "p" ? "纯 Prefill" : "纯 Decode";
    const header = `<header class="sim-result-head"><h2>${phase} QPS</h2>
      ${scan ? `<button type="button" class="sim-button" data-sim-chart="${side}">查看完整扫描 ↗</button>` : ""}</header>`;
    if (!scan) {
      field(side + "-result").innerHTML = header + `<p class="sim-empty" role="status">${empty}</p>`;
      return;
    }
    const feasible = scan.candidates.filter(point => point.pass).sort((a, b) =>
      Math.abs(a.qps - b.qps) < 1e-12 ? a.batch - b.batch : b.qps - a.qps);
    const best = feasible[0];
    const diagnostic = best ?? scan.candidates[0];
    scan.best = best;
    const metrics = best ? [["Batch / DP", fmt(best.batch, 0)],
      ...(side === "p" ? ["ttft"] : ["itl", "tpot"]).map(key => [metricNames[key], seconds(best[key]) + " s"])] : [];
    const throughput = best ? `${speed(best.qps / scan.replicas)} req/s / 副本 · ${fmt(best.qps * scan.tokens, 0)} ${side === "p" ? "输入" : "生成"} tok/s` : outcome(diagnostic, scan) + `（B${diagnostic.batch}）`;
    const capacity = scan.capacity === undefined ? `KV 需求 ${fmt(diagnostic.kv, 0)} tokens / rank · 容量待填写`
      : `KV 需求 ${fmt(diagnostic.kv, 0)} / ${fmt(scan.capacity, 0)} ${scan.kvUnit} / rank`;
    const resources = side === "p" ? `${gib(scan.kvBytes)} / rank · ${fmt(diagnostic.batch * scan.uncached, 0)} 待算 tokens / DP / 批`
      : best ? `${fmt(best.batch * scan.replicas, 0)} 个在途请求 · 等效 ${fmt(best.itl / best.tpot)} tokens / 轮` : "";
    const budget = scan.budget;
    const budgetLine = budget ? `<p>第 3 页联动 · 权重 ${fmt(budget.weights)} + 预留 ${fmt(budget.reserved)} + 本档 KV ${fmt(diagnostic.bytes / GIB)} GiB / rank</p>
      <p>HBM 预算 ${fmt(budget.cap)} / ${fmt(budget.card)} GiB · KV 池 ${fmt(budget.blocks, 0)} IDs</p>` : "";
    field(side + "-result").innerHTML = header + `
      <p class="sim-profile">${scan.profile} · ${scan.replicas} DP</p>
      <div class="sim-headline" aria-live="polite"><strong>${best ? speed(best.qps) : "—"}</strong><span>req/s</span></div>
      <p class="sim-throughput">${throughput}</p>
      ${best ? `<dl class="sim-metrics">${metrics.map(([name, content]) => `<div><dt>${name}</dt><dd>${content}</dd></div>`).join("")}</dl>` : ""}
      <p class="sim-anchors">${scan.anchor}</p>
      ${chart(scan, best, phase)}
      <div class="sim-capacity"><p>${capacity}</p>${resources ? `<p>${resources}</p>` : ""}${budgetLine}</div>
      <div class="sim-candidates"><h3>最优候选</h3><span>${feasible.length} / ${scan.candidates.length} 档可行${scan.capacity === undefined ? " · 仅校验时延" : ""}</span></div>
      ${best ? candidateTable(scan, feasible.slice(0, 5), best) : '<p class="sim-empty">当前约束下没有可行档位。</p>'}`;
  }

  let latest = {};
  const cases = ["b48", "b2", "b4"].map(profile => ({
    label: `P · ${pProfiles[profile].label} · 128K 冷 C1`,
    fields: { input: referenceInput, output: 1, "p-profile": profile, "p-prefix": 0, "p-fixed": 1, "p-budget-source": "reference" },
  }));
  for (const [profile, config] of Object.entries(dProfiles)) {
    for (const row of config.rows) {
      cases.push({
        label: `D · ${config.label} · ${(config.input ?? referenceInput) / 1024}K → ${config.output ?? referenceOutput} · B${row.batch}`,
        fields: { input: config.input ?? referenceInput, output: config.output ?? referenceOutput,
          "d-profile": profile, "d-fixed": row.batch, "d-batch": config.rows.at(-1).batch,
          "d-range": "limit", "d-context": 0, "d-prefix": 100, "d-capacity": "", "d-budget-source": "reference", yield: "" },
      });
    }
  }
  cases.forEach((item, index) => field("case").add(new Option(item.label, String(index))));

  function render() {
    const dProfile = dProfiles[field("d-profile").value];
    field("yield").disabled = !dProfile.mtp;
    field("yield").placeholder = dProfile.mtp ? "随 Batch 校准" : "沿用实测 TPOT";
    field("d-capacity").placeholder = dProfile.capacity === undefined ? "可填写实测容量" : fmt(dProfile.capacity, 0);
    const constraint = field("d-constraint").value;
    field("itl").disabled = constraint === "tpot";
    field("tpot").disabled = constraint === "itl";
    const input = value("input");
    const output = value("output");
    const pBudget = linkedBudget("p", field("p-profile").value === "b48" ? "a3" : field("p-profile").value, "pr");
    const dBudget = linkedBudget("d", dProfile.capacity ? "dt" : null, "dt");
    const pValid = valid(["input", "ttft", "p-replicas", "p-batch", "p-prefix", "p-fixed"]);
    const dValid = valid(["input", "output", "itl", "tpot", "yield", "d-replicas", "d-batch", "d-prefix", "d-capacity", "d-context", "d-fixed"]);
    const dMax = field("d-range").value === "limit" ? Math.min(value("d-batch"), dProfile.rows.at(-1).batch) : value("d-batch");
    const invalid = "请把输入调整到有效范围。";
    const pError = !pValid ? invalid : input + 1 > 131104 ? "输入加首 token 超过该 Prefill 配置的 131,104 tokens 上限。"
      : value("p-fixed") > value("p-batch") ? "固定 Batch 超过 P 的搜索上限。" : pBudget?.error;
    const dError = !dValid ? invalid : output === 1 ? "输出仅 1 token，由 Prefill 完成。"
      : input + output > 133120 ? "输入与输出总长度超过该 Decode 配置的 133,120 tokens 上限。"
      : value("d-fixed") > dMax ? `固定 Batch 超过当前可扫描的 B${dMax}。` : dBudget?.error;
    latest = {
      p: pError ? null : scanPrefill(input, pBudget),
      d: dError ? null : scanDecode(input, output, dProfile, dBudget, dMax),
    };
    renderResult("p", latest.p, pError);
    renderResult("d", latest.d, dError);
  }

  form.addEventListener("submit", event => event.preventDefault());
  form.addEventListener("input", event => {
    if (event.target === field("case")) return;
    field("case").value = "";
    field("case-note").textContent = "";
    render();
  });
  field("case").addEventListener("change", () => {
    const selected = field("case").value === "" ? null : cases[Number(field("case").value)];
    if (!selected) {
      field("case-note").textContent = "";
      return;
    }
    for (const [name, setting] of Object.entries(selected.fields)) field(name).value = setting;
    field("case-note").textContent = "已载入长度和固定 Batch，沿用当前时延上限。";
    render();
  });
  form.addEventListener("reset", () => requestAnimationFrame(() => {
    field("case-note").textContent = "";
    render();
  }));
  window.addEventListener("qwen-rank-budget", render);
  form.addEventListener("click", event => {
    const button = event.target.closest("[data-sim-chart]");
    if (!button) return;
    const side = button.dataset.simChart;
    const scan = latest[side];
    const phase = side === "p" ? "纯 Prefill" : "纯 Decode";
    field("dialog-title").textContent = phase + " · Batch 扫描";
    dialog.classList.toggle("sim-decode", side === "d");
    field("dialog-content").innerHTML = chart(scan, scan.best, phase) + candidateTable(scan, scan.candidates, scan.best, true);
    dialog.showModal();
  });
  field("method-link").addEventListener("click", () => {
    field("method").open = true;
    field("method").scrollIntoView({ block: "start" });
    field("method").querySelector("summary").focus({ preventScroll: true });
  });
  render();
})();
