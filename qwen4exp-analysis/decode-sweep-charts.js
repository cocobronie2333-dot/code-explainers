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
  const kernelStat = element("batch-kernel-stat");
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

  function chart(parent, { title, axis, unit, batches, points, series, ceiling, isKernel = false }) {
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
    const context = canvas.getContext("2d");
    const byBatch = new Map(points.map(point => [point.batch, point]));
    const values = points.flatMap(point => series.map(metric => metric.value(point))).filter(Number.isFinite);
    const max = ceiling ?? yCeiling(values);
    let active = batches.findLastIndex(batch => byBatch.has(batch));
    let plot = null;

    function describe() {
      const batch = batches[active];
      const point = byBatch.get(batch);
      const readings = point ? series.map(metric => `${metric.label} ${format(metric.value(point))} ${unit}`) : ["该档无此算子样本"];
      if (point?.calls) readings.push(`${count(point.calls)} 次 · ${cores[point.core] ?? point.core}`);
      detail.textContent = `B${batch} · ${readings.join(" · ")}`;
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
      const top = 8;
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
    const batches = data.verified.map(row => row.batch);
    const stat = kernelStat.value;
    disconnectOperators = data.kernels.map(kernel => chart(container, {
      title: kernel.name,
      axis: "μs / rank / 次 · 实际 Batch（每 DP rank）",
      unit: "μs",
      batches,
      points: kernel.points,
      isKernel: true,
      series: [
        { label: "均值", value: point => point.mean_us },
        { label: stat === "p95_us" ? "P95" : "P50", value: point => point[stat] },
      ],
    }));
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
  element("batch-kernel-context").textContent = data.kernels.length
    ? `Decode rank 0（宿主 NPU 4） · ${data.verified.map(row => "B" + row.batch).join(" / ")} · 按 B${data.sort_batch} 的累计耗时排序`
    : "Decode rank 0（宿主 NPU 4）";
  element("batch-kernel-note").textContent = data.kernels.length
    ? "横轴为实际 Batch 的等距档位。每档采集 8 个输出步，按设备侧 metadata 保留主要 Batch 对应的时间窗。耗时统计包含主模型和 MTP 草稿的调用。"
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
