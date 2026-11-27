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
  const reduced = window.qwenReducedDecodeSweep;
  const operatorGroups = [
    ["GDN · 状态更新与门控", ["RecurrentGatedDeltaRule", "fused_gdn_gating_kernel"]],
    ["QSA · 稀疏索引与注意力", ["LightningIndexerV2", "LightningIndexerV2Metadata", "LightningIndexer",
      "Index", "SearchSorted", "GenericBlockSparseAttention", "GenericBlockSparseAttentionMetadata",
      "SparseFlashAttention", "FusedInferAttentionScore"]],
    ["MoE · 分发、专家计算与回收", ["MoeDistributeDispatchV3", "MoeDistributeDispatchV2",
      "GroupedMatmulSwigluQuantV2", "GroupedMatmulSwigluQuant", "GroupedMatmul", "MoeDistributeCombineV3", "MoeDistributeCombineV2"]],
    ["投影与 HC · 高频矩阵乘和跨层混合", ["MatMulV3", "MatMulV2", "_hc_combine_norm_kernel", "_hc_gate_mix_kernel"]],
    ["集合通信 · AllReduce / AllGather", ["hcom_allReduce_", "hcom_allGather_",
      "hcom_allGather_AicpuKernel", "HcclLaunchAicpuKernel"]],
  ];
  const openOperatorGroups = new Map([[operatorGroups[0][0], true]]);
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

  function chart(parent, { title, axis, unit, batches, points, series, ceiling, isKernel = false, pointDetail, pipelines = [], scope, rank, linearBatch = false }) {
    const frame = add(parent, "figure", "decode-chart");
    const heading = add(frame, "h3");
    if (rank) add(heading, "span", "hotspot-rank", String(rank).padStart(2, "0"));
    if (isKernel) add(heading, "code", "", title);
    else heading.textContent = title;
    if (scope) add(heading, "span", "chart-scope", scope);
    add(frame, "p", "curve-unit", axis);
    const canvas = add(frame, "canvas");
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", `${title}${scope ? " · " + scope : ""}，单位 ${unit}，用方向键查看 Batch 采样点`);
    const detail = add(frame, "figcaption", "curve-detail");
    detail.id = `decode-curve-detail-${++chartCount}`;
    canvas.setAttribute("aria-describedby", detail.id);
    const legend = add(frame, "div", "decode-chart-legend");
    for (const [i, metric] of series.entries()) {
      const entry = add(legend, "span");
      add(entry, "i").style.setProperty("--curve", colors[i]);
      entry.append(metric.label);
    }
    const communication = title.startsWith("hcom_") || title === "HcclLaunchAicpuKernel";
    const context = canvas.getContext("2d");
    const byBatch = new Map(points.map(point => [point.batch, point]));
    const dense = batches.length > 24;
    const tickIndices = dense ? [0, 19, 39, 59, batches.length - 1] : [...batches.keys()];
    const values = points.flatMap(point => series.map(metric => metric.value(point))).filter(Number.isFinite);
    const max = ceiling ?? yCeiling(values);
    const position = index => linearBatch ? (batches[index] - batches[0]) / (batches.at(-1) - batches[0]) : index / (batches.length - 1);
    let active = batches.findLastIndex(batch => byBatch.has(batch));
    let plot = null;
    const batchButtons = [];
    let batchRange;
    let batchRangeValue;
    let pipelineDetail;
    if (pipelines.length) {
      const batchList = add(frame, "div", "pipeline-batch-list");
      batchList.setAttribute("role", "group");
      batchList.setAttribute("aria-label", "按实际 Batch 查看流水线计数");
      if (dense) {
        const label = add(batchList, "label", "dense-batch-control", "实际 Batch ");
        batchRangeValue = add(label, "output");
        batchRange = add(label, "input");
        Object.assign(batchRange, { type: "range", min: 0, max: batches.length - 1, value: active });
        batchRange.addEventListener("input", () => select(Number(batchRange.value)));
      }
      for (const [index, batch] of dense ? [] : batches.entries()) {
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
      if (batchRange) {
        batchRange.value = active;
        batchRangeValue.value = batch;
        batchRange.setAttribute("aria-valuetext", `B${batch}`);
      }
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
      const x = index => batches.length > 1 ? left + (right - left) * position(index) : (left + right) / 2;
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
      const ticks = dense && !tickIndices.includes(active) ? [...tickIndices, active] : tickIndices;
      for (const i of ticks) {
        const line = x(i);
        context.strokeStyle = i === active ? "#7a718c" : "#23252e";
        context.beginPath();
        context.moveTo(line, top);
        context.lineTo(line, bottom);
        context.stroke();
        context.textAlign = "center";
        context.fillStyle = i === active ? "#f5f2fb" : "#a8a8b7";
        if ((!dense && !linearBatch) || i === active || Math.abs(x(i) - x(active)) >= 18) {
          context.fillText(String(batches[i]), line, bottom + 12);
        }
      }
      for (const [i, metric] of series.entries()) {
        const readings = batches.map(batch => byBatch.has(batch) ? metric.value(byBatch.get(batch)) : null);
        context.strokeStyle = colors[i];
        context.lineWidth = 1.75;
        context.setLineDash(i === 0 ? [] : [5, 3]);
        context.beginPath();
        let connect = false;
        for (const [j, value] of readings.entries()) {
          if (!Number.isFinite(value)) {
            if (!metric.sampledBatches || metric.sampledBatches.has(batches[j])) connect = false;
            continue;
          }
          if (connect) context.lineTo(x(j), y(value));
          else context.moveTo(x(j), y(value));
          connect = true;
        }
        context.stroke();
        context.setLineDash([]);
        for (const [j, value] of readings.entries()) {
          if (!Number.isFinite(value)) continue;
          context.fillStyle = colors[i];
          context.beginPath();
          context.arc(x(j), y(value), j === active ? 3.8 : dense ? 1.35 : 2.6, 0, Math.PI * 2);
          context.fill();
        }
      }
      if (pipelines.length) drawPipelineLabels(x, y, left, right, bottom);
    }

    function drawPipelineLabels(x, y, left, right, bottom) {
      const occupied = [];
      const order = [...new Set([active, ...tickIndices])];
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
      const nearest = batches.reduce((best, _, index) =>
        Math.abs(position(index) - relative) < Math.abs(position(best) - relative) ? index : best, 0);
      select(nearest);
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
    for (const group of container.querySelectorAll(".decode-operator-group")) {
      openOperatorGroups.set(group.dataset.operatorGroup, group.open);
    }
    container.replaceChildren();
    const hardware = kernelDataset.value === "a3";
    const reducedMode = kernelDataset.value === "reduced";
    const baseData = reducedMode ? reduced.dt : hardware && a3.mtp === 0 ? comparison : data;
    const otherData = reducedMode ? reduced.a3 : hardware ? a3 : kernelDataset.value === "compare" ? comparison : null;
    const compare = Boolean(otherData);
    const labels = hardware || reducedMode ? ["950DT", "A3"] : ["MTP5", "MTP 关闭"];
    const compareSteps = new Map((otherData?.verified ?? []).map(row => [row.batch, row.steps]));
    const batches = reducedMode ? Array.from({ length: 80 }, (_, i) => i + 1)
      : baseData.verified.map(row => row.batch).filter(batch => !compare || compareSteps.has(batch));
    const stepsByBatch = new Map(baseData.verified.map(row => [row.batch, row.steps]));
    const kernels = new Map(baseData.kernels.map(kernel => [kernel.name, kernel]));
    const otherKernels = new Map((otherData?.kernels ?? []).map(kernel => [kernel.name, kernel]));
    const visible = new Set(hardware || reducedMode ? [...kernels.keys(), ...otherKernels.keys()] : kernels.keys());
    for (const option of kernelStat.options) {
      option.hidden = reducedMode ? option.value.endsWith("_us") : option.value === "reduced_mean";
    }
    if (kernelStat.selectedOptions[0].hidden || (compare && !reducedMode)) kernelStat.value = "step_ms";
    const stat = kernelStat.value;
    const perStep = stat === "step_ms";
    kernelStat.disabled = compare && !reducedMode;
    const mode = reducedMode ? "950DT / A3 · 4 层 + MTP5 · TP4/EP4" : hardware ? `48 层 · ${a3.kernelContext}`
      : compare ? "仅 950DT · 48 层 · MTP5 / MTP 关闭" : "仅 950DT · 48 层 · MTP5";
    const batchLabel = reducedMode ? "B1–B80" : batches.map(batch => "B" + batch).join(" / ");
    element("batch-kernel-context").textContent = `${mode} · Decode rank 0 · ${batchLabel}`;
    const calculation = "每步累计为同一 Profiling Type 的设备耗时之和除以保留的调度步数。";
    element("batch-kernel-note").textContent = hardware || reducedMode
      ? `紫色实线为 950DT，橙色虚线为 A3。按相同 Profiling Type 配对，设备无该算子样本时会标出。${calculation}`
      : `${calculation}不同 Stream 的事件可重叠。${stat === "step_ms" && !compare ? baselineBatchNote : ""}`;
    if (reduced) element("reduced-decode-sweep").hidden = !reducedMode;
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
          const paired = batches.map(batch => ({ batch, baseline: baseline.get(batch), other: other.get(batch) }))
            .filter(point => point.baseline || point.other);
          if (!paired.length) continue;
          const unit = perStep ? "ms" : "μs";
          disconnectOperators.push(chart(grid, { title: name,
            scope: perStep ? "每调度步累计" : "单次调用均值",
            axis: `${unit} / rank / ${perStep ? "Decode 调度步" : "次调用"} · 相同实际 Batch`,
            unit, batches, points: paired, isKernel: true,
            series: [
              {
                label: paired.some(point => point.baseline) ? labels[0] : `${labels[0]} · 无样本`, value: point => point.baseline
                  ? (perStep ? point.baseline.total_us / point.baseline.steps / 1000 : point.baseline.mean_us)
                  : null,
              },
              {
                label: paired.some(point => point.other) ? labels[1] : `${labels[1]} · 无样本`, value: point => point.other
                  ? (perStep ? point.other.total_us / compareSteps.get(point.batch) / 1000 : point.other.mean_us)
                  : null,
              },
            ],
            pipelines: [{ label: labels[0], sample: point => point.baseline?.pipeline }, { label: labels[1], sample: point => point.other?.pipeline }],
            pointDetail: point => [point.baseline && `${labels[0]} ${count(point.baseline.calls)} 次 / ${point.baseline.steps} 步`,
              point.other && `${labels[1]} ${count(point.other.calls)} 次 / ${compareSteps.get(point.batch)} 步`].filter(Boolean),
          }));
          continue;
        }
        disconnectOperators.push(chart(grid, { title: name,
          scope: perStep ? "每调度步累计" : "单次调用均值与分位",
          axis: `${perStep ? "ms / rank / Decode 调度步" : "μs / rank / 次调用"} · 实际 Batch（每 DP rank）`,
          unit: perStep ? "ms" : "μs", batches, points, isKernel: true, series,
          pipelines: [{ label: "MTP5", sample: point => point.pipeline }] }));
      }
    }
    const hasPoint = name => [kernels.get(name), otherKernels.get(name)]
      .some(kernel => kernel?.points.some(point => batches.includes(point.batch)));
    for (const [label, names] of operatorGroups) {
      if (!names.some(name => visible.has(name) && hasPoint(name))) continue;
      const section = add(container, "details", "decode-operator-group");
      section.dataset.operatorGroup = label;
      section.open = openOperatorGroups.get(label) ?? false;
      add(section, "summary", "decode-group-title", label);
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

  function renderReducedComparison(pairs) {
    if (!pairs.length) return;
    const devices = [["dt", "950DT"], ["a3", "A3"]];
    const operators = ["RecurrentGatedDeltaRule", "GenericBlockSparseAttention", "LightningIndexerV2"];
    const durations = Object.fromEntries(devices.map(([device]) => [device, new Map(
      reduced[device].kernels.filter(kernel => operators.includes(kernel.name)).map(kernel => [
        kernel.name, new Map(kernel.points.map(point => [point.batch, point.total_us])),
      ]),
    )]));
    function elapsedPerStep(point, device, operator) {
      return durations[device].get(operator)?.get(point.batch) / point[device].steps / 1000;
    }
    const plots = element("a3-reduced-charts");
    const batches = pairs.map(point => point.batch);
    for (const title of operators) {
      chart(plots, { title, axis: "ms / rank / Decode 步 · 实际 Batch", unit: "ms", batches, points: pairs, isKernel: true,
        scope: "减层 · 每步累计",
        series: devices.map(([device, label]) => ({ label, value: point => elapsedPerStep(point, device, title) })),
      });
    }
    const tbody = element("a3-reduced-rows");
    for (const point of pairs) {
      const row = add(tbody, "tr");
      add(row, "th", "", `B${point.batch}`).scope = "row";
      for (const [device] of devices) {
        for (const operator of operators) {
          const value = elapsedPerStep(point, device, operator);
          add(row, "td", "number", Number.isFinite(value) ? format(value) : "—");
        }
        const { accepted, drafted } = point[device];
        add(row, "td", "number", drafted > 0 ? `${(100 * accepted / drafted).toFixed(3)}%` : "—");
      }
    }
    element("a3-comparison-context").textContent = `减层实测 · B${batches[0]}–B${batches.at(-1)} · ${batches.length} 档 · 4 层 + MTP5 · W8A8 · TP4/EP4`;
    element("a3-reduced-results").hidden = false;
    element("a3-comparison").hidden = false;
    element("a3-full-results").open = false;
    element("a3-reduced-kernel-link").addEventListener("click", () => {
      if (kernelDataset.value !== "reduced") {
        kernelDataset.value = "reduced";
        renderOperators();
      }
    });
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
  const adjustedBatches = data.verified.filter(row => row.steps < 8 || row.batch !== row.submitted_batch)
    .map(row => row.batch === row.submitted_batch ? `B${row.batch} 保留 ${row.steps}/8 步`
      : `提交 B${row.submitted_batch} 的回放取实际 B${row.batch} 的 ${row.steps}/8 步`);
  const failedBatches = Object.keys(data.failures);
  const baselineBatchNote = (adjustedBatches.length ? ` ${adjustedBatches.join("，")}。` : "") +
    (failedBatches.length ? ` 待复核档位 ${failedBatches.map(batch => "B" + batch).join(" / ")}。` : "");
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
      kernelDataset.prepend(new Option("950DT / A3 · 48 层对照", "a3"));
      kernelDataset.value = "a3";
    }
    if (paired.length) {
      element("ascend-intro").textContent = "950DT 与 A3 的在线 Decode 跑分及 rank 0 算子采集。";
      element("a3-comparison").hidden = false;
      element("a3-comparison-context").textContent = a3.context;
      element("a3-full-results").hidden = false;
      element("a3-full-comparison-context").textContent = a3.context;
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
  if (reduced) {
    const a3Batches = new Map(reduced.a3.verified.map(row => [row.batch, row]));
    const paired = reduced.dt.verified.filter(row => a3Batches.has(row.batch));
    renderReducedComparison(paired.map(dt => ({ batch: dt.batch, dt, a3: a3Batches.get(dt.batch) })));
    element("batch-kernel-dataset-field").hidden = false;
    kernelDataset.prepend(new Option("950DT / A3 · 4 层 · B1–B80", "reduced"));
    kernelDataset.value = "reduced";
    element("reduced-decode-context").textContent = `已核实 950DT ${reduced.dt.verified.length}/80 档、A3 ${reduced.a3.verified.length}/80 档，同 Batch 配对 ${paired.length} 档。未验证或未采到该算子的档位留空。`;
    element("reduced-decode-data").href = URL.createObjectURL(new Blob([JSON.stringify(reduced, null, 2)], { type: "application/json" }));
    if (location.hash === "#reduced-decode-sweep") {
      element("reduced-decode-sweep").open = true;
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
  function csvDownload(id, header, rows) {
    const csv = [header, ...rows].map(row => row.map(value =>
      '"' + String(value ?? "").replaceAll('"', '""') + '"').join(",")).join("\r\n");
    const link = element(id);
    if (link.href.startsWith("blob:")) URL.revokeObjectURL(link.href);
    link.href = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  }

  function renderFullItl() {
    const runs = [["950DT", "TP4/EP4", data], ["A3", "TP8/EP8", a3]];
    const points = new Map();
    const rows = [];
    for (const [device, topology, run] of runs) {
      const matched = new Set(run.verified.filter(trace => trace.batch === trace.submitted_batch).map(trace => trace.batch));
      for (const sample of run.perf.filter(row => matched.has(row.batch))) {
        if (!points.has(sample.batch)) points.set(sample.batch, { batch: sample.batch });
        points.get(sample.batch)[device] = sample.itl_mean_ms;
        rows.push([device, topology, 48, 5, sample.input_tokens_per_request, sample.output_tokens_per_request,
          sample.batch, sample.itl_mean_ms, sample.itl_samples, sample.tpot_mean_ms, sample.decoded_tokens_per_s]);
      }
    }
    const ordered = [...points.values()].sort((left, right) => left.batch - right.batch);
    chart(element("full-itl-chart"), { title: "整模 ITL · 48 层输出步均值", axis: "ms / 输出步 · 已核对的 Batch 档位 / DP",
      linearBatch: true,
      unit: "ms", batches: ordered.map(point => point.batch), points: ordered,
      series: runs.map(([device]) => ({ label: device, value: point => point[device] })) });
    csvDownload("full-itl-download", ["device", "topology", "layers", "mtp_draft_tokens", "input_tokens",
      "output_tokens", "batch", "itl_mean_ms", "itl_samples", "tpot_mean_ms", "generated_tokens_per_s"], rows);
  }

  function setupFullHotspots() {
    const full = window.qwenFullDecodeHotspots;
    const ranks = {
      dt: window.qwenValidation.profile.top_kernels_by_sum.slice(0, 15)
        .map(row => ({ name: row.type, total_us: row.sum_device_ms * 1000, calls: row.count })),
      a3: full.a3Rank,
    };
    const device = (label, topology, run, kernels = run.kernels) => ({
      label, topology, steps: new Map(run.verified.map(row => [row.batch, row])),
      kernels: new Map(kernels.map(kernel => [kernel.name, kernel.points])),
    });
    const fullRuns = [
      device("950DT", "TP4/EP4", data),
      device("A3", "TP8/EP8", a3, [...a3.kernels, ...full.a3Kernels]),
    ];
    const reducedRuns = [
      device("950DT", "TP4/EP4", reduced.dt),
      device("A3", "TP4/EP4", reduced.a3),
    ];
    const rankPicker = element("full-hotspot-rank");
    const sweepPicker = element("full-hotspot-sweep");
    const statsPicker = element("full-hotspot-stat");
    const container = element("full-hotspot-charts");
    let release = [];
    function render() {
      release.forEach(disconnect => disconnect());
      release = [];
      container.replaceChildren();
      const perStep = statsPicker.value === "step_ms";
      const reducedSweep = sweepPicker.value === "reduced";
      const devices = reducedSweep ? reducedRuns : fullRuns;
      const batches = [...new Set(devices.flatMap(run => [...run.steps.keys()]))].sort((a, b) => a - b);
      const layers = reducedSweep ? reduced.targetLayers : 48;
      const sweepLabel = reducedSweep ? "4 层减层" : "48 层满层";
      const ranking = ranks[rankPicker.value];
      const scopeName = rankPicker.value === "dt" ? "950DT C1 · 原始长窗" : "A3 B8 · 8 个核对调度步";
      element("full-hotspot-note").textContent = `排名参考 48 层 ${scopeName} · Top ${ranking.length}。曲线使用${sweepLabel} trace · rank 0 · ${devices.map(run => `${run.label} ${run.steps.size} 档`).join(" / ")}。`;
      element("full-hotspot-coverage-note").textContent = reducedSweep
        ? "两台设备都核对了 B1–B80，每档取 3 个实际 Decode 调度步。Slice、Mul 和 _hc_gate_mix_kernel 均有双机同名曲线。覆盖数字统计已导出的同名 Profiling Type，V2、V3 等不同类型各自保留。"
        : "950DT 的实测档位为 B1、B2、B4、B8、B16、B17，A3 为 B1、B4、B8。950DT 的 B17 来自提交 B32 的 trace。连线连接各设备相邻的已采点，空档表示本设备已采该 Batch，但导出中缺少同名 Type。";
      const rows = [];
      for (const [offset, entry] of ranking.entries()) {
        const tracks = devices.map(device => new Map((device.kernels.get(entry.name) ?? []).map(point => [point.batch, point])));
        const points = batches.map(batch => ({ batch, samples: tracks.map(track => track.get(batch)) }));
        const rank = offset + 1;
        for (const point of points) {
          devices.forEach((device, index) => {
            const trace = device.steps.get(point.batch);
            const sample = point.samples[index];
            if (!trace) return;
            rows.push([scopeName, rank, entry.name, entry.total_us, entry.calls, device.label, device.topology, layers, 5,
              trace.submitted_batch ?? trace.batch, point.batch, trace.steps, sample?.calls, sample?.total_us, sample?.mean_us,
              sample ? sample.total_us / trace.steps / 1000 : null, sample ? "sample" : "missing_type"]);
          });
        }
        const coverage = devices.map((run, index) => `${run.label} ${tracks[index].size}/${run.steps.size} 档`);
        if (tracks.every(track => track.size === 0)) {
          const missing = add(container, "figure", "decode-chart");
          const title = add(missing, "h3");
          add(title, "span", "hotspot-rank", String(rank).padStart(2, "0"));
          add(title, "code", "", entry.name);
          add(missing, "p", "curve-unit", `${sweepLabel} · ${coverage.join(" · ")}`);
          add(missing, "p", "curve-detail", "当前曲线数据未导出同名 Type。");
          continue;
        }
        const unit = perStep ? "ms" : "μs";
        release.push(chart(container, { title: entry.name, rank, isKernel: true, unit, batches, points, linearBatch: true,
          scope: `${sweepLabel} · ${perStep ? "每步累计" : "单次均值"}`,
          axis: `${coverage.join(" · ")} · ${unit} / rank / ${perStep ? "调度步" : "次调用"} · 排名参考 ${format(entry.total_us / 1000)} ms`,
          series: devices.map((device, index) => ({
            label: coverage[index],
            sampledBatches: device.steps,
            value: point => {
              const sample = point.samples[index];
              if (!sample) return null;
              return perStep ? sample.total_us / device.steps.get(point.batch).steps / 1000 : sample.mean_us;
            },
          })),
          pointDetail: point => point.samples.map((sample, index) =>
            sample && `${devices[index].label} ${count(sample.calls)} 次 / ${devices[index].steps.get(point.batch).steps} 步`).filter(Boolean),
          pipelines: devices.map((device, index) => ({ label: device.label, sample: point => point.samples[index]?.pipeline })),
        }));
      }
      element("full-hotspot-download").download = `qwen4exp-hotspots-${reducedSweep ? "4-layer-b1-b80" : "48-layer"}.csv`;
      csvDownload("full-hotspot-download", ["rank_source", "rank", "profiling_type", "rank_total_device_us", "rank_calls",
        "device", "topology", "layers", "mtp_draft_tokens", "submitted_batch", "actual_batch", "steps", "calls",
        "sum_device_us", "per_call_mean_us", "per_step_sum_ms", "sample_status"], rows);
    }
    rankPicker.addEventListener("change", render);
    sweepPicker.addEventListener("change", render);
    statsPicker.addEventListener("change", render);
    render();
  }

  renderOperators();
  renderFullItl();
  setupFullHotspots();
  const gdnType = "RecurrentGatedDeltaRule";
  const gdnRuns = [["950DT", data], ["A3", a3]].map(([label, run]) => ({
    label, samples: new Map(run.kernels.find(kernel => kernel.name === gdnType).points.map(point => [point.batch, point])),
  }));
  const gdnBatches = [1, 4, 8];
  chart(element("gdn-compare-chart"), {
    title: gdnType, isKernel: true, scope: "满层 · 单次均值", unit: "μs",
    axis: "μs / 次调用 · 实际 Batch / DP", batches: gdnBatches, points: gdnBatches.map(batch => ({ batch })), linearBatch: true,
    series: gdnRuns.map(run => ({ label: run.label, value: point => run.samples.get(point.batch)?.mean_us })),
  });
})();
