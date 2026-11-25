"use strict";

(() => {
  const data = window.qwenDecodeSweep;
  const element = id => document.getElementById(id);
  const colors = ["#c8b9ff", "#f5c987"];
  const count = value => Number(value).toLocaleString("en-US");
  const format = value => value >= 100 ? value.toFixed(1) : value.toFixed(2);
  const cores = {
    AI_VECTOR_CORE: "Vector",
    AI_CORE: "Cube",
    MIX_AIC: "Mix AIC",
    MIX_AIV: "Mix AIV",
    COMMUNICATION: "通信",
  };
  const pipelineNames = ["MTE1", "MTE2", "MTE3", "Vector", "Cube", "Scalar", "Fixpipe"];
  const coverageThreshold = 80;
  const nearPeakRatio = 0.9;

  function pipelineLabel(sample, communication) {
    if (!sample || sample.coverage < coverageThreshold) return communication ? "通信" : "计数不足";
    const scores = Object.entries(sample.scores).sort((a, b) => b[1] - a[1]);
    const leaders = scores.filter(([, value]) => value >= scores[0][1] * nearPeakRatio);
    return leaders.length > 2 ? "Mixed" : leaders.map(([name]) => name).join("/");
  }
  const kernelStat = element("batch-kernel-stat");
  const kernelDataset = element("batch-kernel-dataset");
  const comparison = data.comparison;
  const a3 = data.a3;
  const operatorGroups = [
    ["GDN · 状态更新与门控", ["RecurrentGatedDeltaRule", "fused_gdn_gating_kernel"]],
    ["QSA · 稀疏索引与注意力", ["LightningIndexerV2", "LightningIndexer", "GenericBlockSparseAttention", "SparseFlashAttention", "FusedInferAttentionScore"]],
    ["MoE · 分发、专家计算与回收", ["MoeDistributeDispatchV3", "MoeDistributeDispatchV2",
      "GroupedMatmulSwigluQuantV2", "GroupedMatmulSwigluQuant", "GroupedMatmul", "MoeDistributeCombineV3", "MoeDistributeCombineV2"]],
    ["投影与 HC · 高频矩阵乘和跨层混合", ["MatMulV3", "MatMulV2", "_hc_combine_norm_kernel"]],
    ["集合通信 · AllReduce / AllGather", ["hcom_allReduce_", "hcom_allGather_"]],
  ];
  let disconnectOperators = [];
  let chartCount = 0;

  function add(parent, tag, className, contents) {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (contents) item.textContent = contents;
    parent.append(item);
    return item;
  }

  function yCeiling(values) {
    const max = Math.max(0, ...values);
    if (max === 0) return 1;
    const step = max / 4;
    const place = 10 ** Math.floor(Math.log10(step));
    const unit = [1, 2, 2.5, 5, 10].find(value => value * place >= step);
    return unit * place * 4;
  }

  function chart(parent, { title, axis, unit, batches, points, series, ceiling, isKernel = false, pointDetail, pipelines = [] }) {
    const frame = add(parent, "figure", "decode-chart");
    const heading = add(frame, "h3");
    if (isKernel) add(heading, "code", "", title);
    else heading.textContent = title;
    add(frame, "p", "curve-unit", axis);
    const canvas = add(frame, "canvas");
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", `${title}，单位 ${unit}，用方向键查看 Batch 采样点`);
    const detail = add(frame, "figcaption", "curve-detail");
    detail.id = `decode-curve-detail-${++chartCount}`;
    canvas.setAttribute("aria-describedby", detail.id);
    const legend = add(frame, "div", "decode-chart-legend");
    for (const [i, metric] of series.entries()) {
      const entry = add(legend, "span");
      add(entry, "i").style.setProperty("--curve", colors[i]);
      entry.append(metric.label);
    }
    const communication = title.startsWith("hcom_");
    const context = canvas.getContext("2d");
    const byBatch = new Map(points.map(point => [point.batch, point]));
    const values = points.flatMap(point => series.map(metric => metric.value(point))).filter(Number.isFinite);
    const max = ceiling ?? yCeiling(values);
    let active = batches.findLastIndex(batch => byBatch.has(batch));
    let plot = null;
    const batchButtons = [];
    let pipelineDetail;
    if (pipelines.length) {
      const batchList = add(frame, "div", "pipeline-batch-list");
      batchList.setAttribute("role", "group");
      batchList.setAttribute("aria-label", "按实际 Batch 查看流水线计数");
      for (const [index, batch] of batches.entries()) {
        const point = byBatch.get(batch);
        const button = add(batchList, "button", "pipeline-batch-button");
        button.type = "button";
        add(button, "b", "", `B${batch}`);
        for (const [trackIndex, track] of pipelines.entries()) {
          const sample = point && track.sample(point);
          const label = sample ? pipelineLabel(sample, communication) : "—";
          const chip = add(button, "span", "pipeline-chip", label);
          chip.style.setProperty("--curve", colors[trackIndex]);
          chip.title = `${track.label} · ${label}`;
        }
        button.addEventListener("click", () => select(index));
        batchButtons.push(button);
      }
      pipelineDetail = add(frame, "div", "pipeline-detail");
      pipelineDetail.id = `${detail.id}-pipelines`;
      canvas.setAttribute("aria-describedby", `${detail.id} ${pipelineDetail.id}`);
    }

    function describe() {
      const batch = batches[active];
      const point = byBatch.get(batch);
      const readings = point ? series.map(metric => {
        const value = metric.value(point);
        return `${metric.label} ${Number.isFinite(value) ? `${format(value)} ${unit}` : "无样本"}`;
      }) : ["该档无此算子样本"];
      if (point?.calls) {
        if (unit === "ms") readings.push(`单次均值 ${format(point.mean_us)} μs · P95 ${format(point.p95_us)} μs`);
        readings.push(`${count(point.calls)} 次 / ${point.steps} 步 · 执行核 ${cores[point.core] ?? point.core}`);
      }
      if (point && pointDetail) readings.push(...pointDetail(point));
      detail.textContent = `B${batch} · ${readings.join(" · ")}`;
      if (pipelineDetail) showPipelines(batch, point);
    }

    function showPipelines(batch, point) {
      batchButtons.forEach((button, index) => button.setAttribute("aria-pressed", String(index === active)));
      pipelineDetail.replaceChildren();
      for (const [index, track] of pipelines.entries()) {
        const sample = point && track.sample(point);
        const row = add(pipelineDetail, "div", "pipeline-detail-row");
        row.style.setProperty("--curve", colors[index]);
        const label = sample ? pipelineLabel(sample, communication) : "无样本";
        add(row, "strong", "", `B${batch} · ${track.label} · ${label}`);
        if (!sample) continue;
        add(row, "small", "", `PMU 覆盖 ${sample.coverage.toFixed(1)}% · ${count(sample.measured_calls)} 次有计数`);
        if (Object.keys(sample.scores).length === 0) continue;
        const metrics = add(row, "dl", "pipeline-metrics");
        for (const name of pipelineNames) {
          const metric = add(metrics, "div");
          add(metric, "dt", "", name);
          add(metric, "dd", "", `${sample.scores[name].toFixed(2)}%`);
        }
      }
    }

    function draw() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      const scale = Math.min(devicePixelRatio || 1, 3);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      const left = max >= 1000 ? 46 : 41;
      const top = pipelines.length ? 16 : 8;
      const right = width - 15;
      const bottom = height - 24;
      const x = index => batches.length > 1 ? left + (right - left) * index / (batches.length - 1) : (left + right) / 2;
      const y = value => bottom - ((bottom - top) * value / max);
      plot = { left, right };
      context.font = '10px "Cascadia Mono", Consolas, monospace';
      context.textBaseline = "middle";
      context.lineWidth = 1;
      for (let i = 0; i <= 4; i += 1) {
        const value = max * i / 4;
        const line = y(value);
        context.strokeStyle = i === 0 ? "#5d5b6c" : "#30313b";
        context.beginPath();
        context.moveTo(left, line);
        context.lineTo(right, line);
        context.stroke();
        context.fillStyle = "#c0bfcd";
        context.textAlign = "right";
        context.fillText(Number(value.toPrecision(3)).toString(), left - 6, line);
      }
      for (const [i, batch] of batches.entries()) {
        const line = x(i);
        context.strokeStyle = i === active ? "#7a718c" : "#23252e";
        context.beginPath();
        context.moveTo(line, top);
        context.lineTo(line, bottom);
        context.stroke();
        context.textAlign = "center";
        context.fillStyle = i === active ? "#f5f2fb" : "#a8a8b7";
        context.fillText(String(batch), line, bottom + 12);
      }
      for (const [i, metric] of series.entries()) {
        const readings = batches.map(batch => byBatch.has(batch) ? metric.value(byBatch.get(batch)) : null);
        context.strokeStyle = colors[i];
        context.lineWidth = 1.75;
        context.setLineDash(i === 0 ? [] : [5, 3]);
        context.beginPath();
        for (const [j, value] of readings.entries()) {
          if (!Number.isFinite(value)) continue;
          if (j > 0 && Number.isFinite(readings[j - 1])) context.lineTo(x(j), y(value));
          else context.moveTo(x(j), y(value));
        }
        context.stroke();
        context.setLineDash([]);
        for (const [j, value] of readings.entries()) {
          if (!Number.isFinite(value)) continue;
          context.fillStyle = colors[i];
          context.beginPath();
          context.arc(x(j), y(value), j === active ? 3.8 : 2.6, 0, Math.PI * 2);
          context.fill();
        }
      }
      if (pipelines.length) drawPipelineLabels(x, y, left, right, bottom);
    }

    function drawPipelineLabels(x, y, left, right, bottom) {
      const occupied = [];
      const order = [active, ...batches.keys()].filter((index, i, all) => all.indexOf(index) === i);
      context.font = '10px "Cascadia Mono", Consolas, monospace';
      context.textAlign = "center";
      for (const index of order) {
        const point = byBatch.get(batches[index]);
        if (!point) continue;
        for (const [trackIndex, track] of pipelines.entries()) {
          const sample = track.sample(point);
          const value = series[trackIndex].value(point);
          if (!sample || !Number.isFinite(value)) continue;
          const label = pipelineLabel(sample, communication);
          const w = context.measureText(label).width + 10;
          const px = Math.max(left, Math.min(right - w, x(index) - w / 2));
          const offsets = trackIndex === 0 ? [-23, 8, -41, 26] : [8, -23, 26, -41];
          const py = offsets.map(offset => y(value) + offset).find(top => top >= 1 && top + 16 <= bottom &&
            !occupied.some(rect => px < rect.x + rect.w + 3 && rect.x < px + w + 3 && top < rect.y + 18 && rect.y < top + 18));
          if (py === undefined) continue;
          occupied.push({ x: px, y: py, w });
          context.beginPath();
          context.roundRect(px, py, w, 16, 3);
          context.fillStyle = "#171924";
          context.fill();
          context.lineWidth = 0.8;
          context.strokeStyle = colors[trackIndex];
          context.stroke();
          context.fillStyle = colors[trackIndex];
          context.fillText(label, px + w / 2, py + 8);
        }
      }
    }

    function select(index) {
      if (index < 0 || index >= batches.length || active === index) return;
      active = index;
      describe();
      draw();
    }

    function pointAt(event) {
      if (!plot || batches.length === 1) return;
      const offset = event.clientX - canvas.getBoundingClientRect().left;
      const relative = Math.max(0, Math.min(1, (offset - plot.left) / (plot.right - plot.left)));
      select(Math.round(relative * (batches.length - 1)));
    }

    canvas.addEventListener("pointermove", pointAt);
    canvas.addEventListener("pointerdown", pointAt);
    canvas.addEventListener("keydown", event => {
      const moves = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: batches.length - 1 };
      if (!(event.key in moves)) return;
      event.preventDefault();
      select(moves[event.key]);
    });
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    describe();
    draw();
    return () => observer.disconnect();
  }

  function renderOperators() {
    disconnectOperators.forEach(disconnect => disconnect());
    const container = element("batch-operators");
    container.replaceChildren();
    const hardware = kernelDataset.value === "a3";
    const baseData = hardware && a3.mtp === 0 ? comparison : data;
    const otherData = hardware ? a3 : kernelDataset.value === "compare" ? comparison : null;
    const compare = Boolean(otherData);
    const labels = hardware ? ["950DT", "A3"] : ["MTP5", "MTP 关闭"];
    const compareSteps = new Map((otherData?.verified ?? []).map(row => [row.batch, row.steps]));
    const batches = baseData.verified.map(row => row.batch).filter(batch => !compare || compareSteps.has(batch));
    const stepsByBatch = new Map(baseData.verified.map(row => [row.batch, row.steps]));
    const kernels = new Map(baseData.kernels.map(kernel => [kernel.name, kernel]));
    const otherKernels = new Map((otherData?.kernels ?? []).map(kernel => [kernel.name, kernel]));
    const visible = new Set(hardware ? [...kernels.keys(), ...otherKernels.keys()] : kernels.keys());
    if (compare) kernelStat.value = "step_ms";
    const stat = kernelStat.value;
    const perStep = stat === "step_ms";
    kernelStat.disabled = Boolean(compare);
    const mode = hardware ? a3.kernelContext : compare ? "950DT · MTP5 / MTP 关闭" : "950DT · MTP5";
    element("batch-kernel-context").textContent = `${mode} · Decode rank 0 · ${batches.map(batch => "B" + batch).join(" / ")}`;
    disconnectOperators = [];
    function addCharts(parent, names) {
      const grid = add(parent, "div", "decode-chart-grid");
      for (const name of names) {
        const kernel = kernels.get(name);
        if (!visible.has(name)) continue;
        const points = (kernel?.points ?? []).map(point => ({ ...point, steps: stepsByBatch.get(point.batch) }));
        const series = perStep ? [{ label: "每步累计", value: point => point.total_us / point.steps / 1000 }] : [
          { label: "均值", value: point => point.mean_us },
          { label: stat === "p95_us" ? "P95" : "P50", value: point => point[stat] },
        ];
        if (compare) {
          const baseline = new Map(points.map(point => [point.batch, point]));
          const other = new Map((otherKernels.get(name)?.points ?? []).map(point => [point.batch, point]));
          const paired = batches.map(batch => ({ batch, baseline: baseline.get(batch), other: other.get(batch) }));
          if (!paired.some(point => point.baseline || point.other)) continue;
          disconnectOperators.push(chart(grid, { title: name,
            axis: "ms / rank / Decode 调度步 · 相同实际 Batch", unit: "ms", batches, points: paired, isKernel: true,
            series: [
              { label: labels[0], value: point => point.baseline ? point.baseline.total_us / point.baseline.steps / 1000 : null },
              { label: labels[1], value: point => point.other ? point.other.total_us / compareSteps.get(point.batch) / 1000 : null },
            ],
            pipelines: [{ label: labels[0], sample: point => point.baseline?.pipeline }, { label: labels[1], sample: point => point.other?.pipeline }],
            pointDetail: point => [point.baseline && `${labels[0]} ${count(point.baseline.calls)} 次 / ${point.baseline.steps} 步`,
              point.other && `${labels[1]} ${count(point.other.calls)} 次 / ${compareSteps.get(point.batch)} 步`].filter(Boolean),
          }));
          continue;
        }
        disconnectOperators.push(chart(grid, { title: name,
          axis: `${perStep ? "ms / rank / Decode 调度步" : "μs / rank / 次调用"} · 实际 Batch（每 DP rank）`,
          unit: perStep ? "ms" : "μs", batches, points, isKernel: true, series,
          pipelines: [{ label: "MTP5", sample: point => point.pipeline }] }));
      }
    }
    const hasPoint = name => [kernels.get(name), otherKernels.get(name)]
      .some(kernel => kernel?.points.some(point => batches.includes(point.batch)));
    for (const [label, names] of operatorGroups) {
      if (!names.some(name => visible.has(name) && hasPoint(name))) continue;
      const section = add(container, "section", "decode-operator-group");
      add(section, "h3", "decode-group-title", label);
      addCharts(section, names);
    }
    const featured = new Set(operatorGroups.flatMap(([, names]) => names));
    const remaining = [...visible].filter(name => !featured.has(name) && hasPoint(name));
    if (remaining.length) {
      const extra = add(container, "details", "decode-operator-extra");
      add(extra, "summary", "decode-group-title", `其他已采集算子（${remaining.length}）`);
      addCharts(extra, remaining);
    }
  }

  const points = data.perf;
  const batches = points.map(point => point.batch);
  const batchSummary = batches.map(batch => "B" + batch).join(" / ");
  element("batch-context").textContent = points.length
    ? `104 · W8A8 · TP4 + EP · MTP5 · 128K → ${points[0].output_tokens_per_request} · ${batchSummary}`
    : "104 · W8A8 · TP4 + EP · MTP5 · 128K 热前缀";
  element("batch-note").textContent = points.length
    ? "Batch 是同一 API 请求提交的序列数，横轴为等距档位。每档进行一轮正式跑分，关闭 profiler，使用相同已预热的 128K 输入。"
    : "Batch 扫描正在采集，下方保留此前的多 token Decode 实测。";
  element("batch-kernel-note").textContent = data.kernels.length
    ? "横轴为实际 Batch 的等距档位。每步累计 = 同一 Profiling Type 的设备耗时之和 ÷ 保留的调度步数。MTP5 曲线含主模型和草稿。不同 Stream 的事件可重叠，整轮延迟请看上方 ITL。"
    : "设备侧 Batch 与稳态步数校验通过后，显示各算子的曲线。";
  const adjustedBatches = data.verified.filter(row => row.steps < 8 || row.batch !== row.submitted_batch);
  if (adjustedBatches.length) {
    const notes = adjustedBatches.map(row => row.batch === row.submitted_batch
      ? `B${row.batch} 保留 ${row.steps}/8 步`
      : `提交 B${row.submitted_batch} 的回放取实际 B${row.batch} 的 ${row.steps}/8 步`);
    element("batch-kernel-note").append(` ${notes.join("，")}。`);
  }
  const failedBatches = Object.keys(data.failures);
  if (failedBatches.length) {
    element("batch-kernel-note").append(` 待复核档位 ${failedBatches.map(batch => "B" + batch).join(" / ")}。`);
  }
  if (comparison) {
    const batchesWithProfiling = new Set(comparison.verified.map(row => row.batch));
    if (data.verified.some(row => batchesWithProfiling.has(row.batch))) {
      element("batch-kernel-dataset-field").hidden = false;
    }
    const basePerformance = new Map(data.perf.map(row => [row.batch, row]));
    const comparable = comparison.perf.filter(row => basePerformance.has(row.batch));
    if (comparable.length) {
      element("batch-comparison").hidden = false;
      element("batch-comparison-context").textContent = comparison.context;
      element("batch-comparison-rows").innerHTML = comparable.map(off => {
        const on = basePerformance.get(off.batch);
        return `<tr><th scope="row">B${off.batch}</th><td class="number">${format(on.tpot_mean_ms)} ms</td><td class="number">${format(off.tpot_mean_ms)} ms</td>
          <td class="number">${format(on.itl_mean_ms)} ms</td><td class="number">${format(off.itl_mean_ms)} ms</td>
          <td class="number">${format(on.decoded_tokens_per_s)} tok/s</td><td class="number">${format(off.decoded_tokens_per_s)} tok/s</td></tr>`;
      }).join("");
    }
  }
  if (a3) {
    const baseline = a3.mtp === 0 ? comparison : data;
    const baselinePerf = new Map(baseline.perf.map(row => [row.batch, row]));
    const paired = a3.perf.filter(row => baselinePerf.has(row.batch)).map(row => ({
      batch: row.batch, baseline: baselinePerf.get(row.batch), a3: row,
    }));
    const baselineBatches = new Set(baseline.verified.map(row => row.batch));
    if (a3.verified.some(row => baselineBatches.has(row.batch))) {
      element("batch-kernel-dataset-field").hidden = false;
      add(kernelDataset, "option", "", "950DT / A3 · 相同实际 Batch").value = "a3";
    }
    if (paired.length) {
      element("ascend-intro").textContent = "950DT 与 A3 的在线 Decode 跑分及 rank 0 算子采集。";
      element("a3-comparison").hidden = false;
      element("a3-comparison-context").textContent = a3.context;
      element("a3-comparison-note").textContent = a3.note;
      element("a3-comparison-kernel-note").textContent = a3.kernelNote;
      const tbody = element("a3-comparison-rows");
      const rows = [
        ["ttft_mean_ms", "ms"],
        ["tpot_mean_ms", "ms"],
        ["itl_mean_ms", "ms"],
        ["decoded_tokens_per_s", "tok/s"],
        ["acceptance_rate", "%", 100],
      ];
      for (const point of paired) {
        for (const [key, label] of [["baseline", "950DT"], ["a3", "A3"]]) {
          const row = add(tbody, "tr");
          add(row, "th", "", `B${point.batch}`).scope = "row";
          add(row, "td", "", `${label} · MTP${a3.mtp || " 关闭"}`);
          for (const [metric, unit, scale = 1] of rows) {
            const value = point[key][metric];
            add(row, "td", "number", Number.isFinite(value) ? `${format(value * scale)} ${unit}` : "—");
          }
          const observed = key === "a3" ? point.a3 : a3.baselinePrefixCache?.[point.batch];
          const cached = observed?.prefix_cache_queries > 0
            ? 100 * observed.prefix_cache_hits / observed.prefix_cache_queries : null;
          add(row, "td", "number", cached === null ? "—" : `${format(cached)} %`);
        }
      }
      const charts = element("a3-comparison-charts");
      const shared = { points: paired, batches: paired.map(point => point.batch) };
      for (const [title, metric, unit] of [
        ["客户端 TPOT", "tpot_mean_ms", "ms"],
        ["输出步 ITL", "itl_mean_ms", "ms"],
        ["生成吞吐", "decoded_tokens_per_s", "tokens/s"],
      ]) {
        chart(charts, { ...shared, title, unit, axis: `${unit} · 提交 Batch（每 DP rank）`,
          series: [{ label: "950DT", value: point => point.baseline[metric] }, { label: "A3", value: point => point.a3[metric] }],
        });
      }
    }
  }
  kernelDataset.addEventListener("change", renderOperators);
  if (points.length) {
    const download = element("batch-download");
    download.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    download.hidden = false;
  }
  kernelStat.disabled = data.kernels.length === 0;
  kernelStat.addEventListener("change", renderOperators);

  if (points.length) {
    const overview = element("batch-overview");
    const shared = { points, batches };
    chart(overview, {
      ...shared, title: "输出时延", axis: "ms · Batch（每 DP rank）", unit: "ms",
      series: [
        { label: "输出步 ITL", value: point => point.itl_mean_ms },
        { label: "客户端 TPOT", value: point => point.tpot_mean_ms },
      ],
    });
    chart(overview, {
      ...shared, title: "生成吞吐", axis: "tokens/s · Batch（每 DP rank）", unit: "tokens/s",
      series: [{ label: "首段之后", value: point => point.decoded_tokens_per_s }],
    });
    chart(overview, {
      ...shared, title: "MTP 接受率", axis: "% · Batch（每 DP rank）", unit: "%", ceiling: 100,
      series: [{ label: "接受 / 草稿", value: point => point.acceptance_rate * 100 }],
    });
  }
  renderOperators();
})();
