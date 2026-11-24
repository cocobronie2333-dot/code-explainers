"use strict";

(() => {
  const width = 1450;
  const upstream = "https://github.com/vllm-project/vllm/blob/c410543d9ffff03f5f6c4a8c0ae1d3ad082c4a15/vllm/";
  const ascend = "https://github.com/vllm-project/vllm-ascend/blob/c64ace678d12d5a48671d929c76f723f8158876c/vllm_ascend/";
  const families = { gdn: "GDN · 36 层", qsa: "QSA · 12 层", moe: "FFN / MoE" };
  const stages = { prefill: "Prefill · TP4", decode: "Decode · TP4 / MTP5" };
  const types = {
    activation: ["激活", "#7bbbff", []],
    gate: ["门控 / 权重", "#edb36b", []],
    cache: ["cache / state", "#b69be8", [6, 4]],
    index: ["索引", "#74d6a4", []],
    meta: ["调度元数据", "#9baebc", [3, 4]],
  };

  function node(id, x, y, w, h, title, kernel, detail, tone = "activation") {
    return { id, x, y, w, h, title, kernel, detail, tone };
  }

  function edge(from, to, type, tensor, ports = ["r", "l"], turns = [], label = null) {
    return { from, to, type, tensor, ports, turns, label };
  }

  function gdnGraph(decode) {
    return {
      height: 520,
      source: ascend + "ops/gdn.py",
      note: decode
        ? "Decode 读取已有 conv / recurrent state。MTP 校验阶段可一次处理多个 token，并按已接受长度与 state indices 更新候选状态。"
        : "Prefill 按 chunk 推进状态。有可用前缀状态时先装载，否则初始化为零。Q/K L2 norm 等步骤可融合到 chunk 实现中。",
      nodes: [
        node("input", 26, 185, 133, 62, "Attention 输入", "HC mix · 单路 hidden", "TP4 每个 rank 从本步的逻辑激活 X[T,H] 发起局部投影。"),
        node("project", 209, 185, 155, 62, "GDN 输入投影", "QKV / z 与 a / b", "局部 QKV 的拼接宽度为 1280。z 用于输出门控，a、b 用于生成衰减与更新参数。"),
        node("conv", 420, 72, 150, 66, "Q/K/V 短卷积", decode ? "CausalConv1dUpdate" : "CausalConv1d", "宽度为 4 的因果卷积只处理 QKV。它读取并更新对应序列的卷积状态。"),
        node("norm", 635, 72, 164, 66, "拆分 Q/K/V · Q/K L2", "rearrange · L2Norm", "逻辑 Q/K 为每 rank [T,4,128]，V 为 [T,12,128]。图中省略 API 内部的外层 batch 轴。"),
        node("gating", 420, 252, 160, 66, "计算递推参数", "FusedGdnGating · A_log / dt_bias", "a 与 b 结合模型参数生成 g 与 β。推测与普通 token 按各自索引切分。", "gate"),
        node("core", 858, 181, 170, 80, decode ? "Recurrent GDN" : "Chunk GDN", decode ? "RecurrentGatedDeltaRule" : "ChunkGatedDeltaRule · ChunkFwdH", "消费 Q/K/V、g/β、序列边界与初始状态，生成局部输出并更新 recurrent state。"),
        node("outgate", 1080, 181, 148, 80, "输出门控归一化", "Gated RMSNorm · z", "用 z 门控局部输出。展开本地 V heads 后交给行并行输出投影。", "gate"),
        node("output", 1280, 181, 146, 80, "Attention 输出", "OProj · TP 汇集", "得到本步 Attention 输出 [T,H]，送进 FFN 的 HC combine_and_mix。"),
        node("meta", 26, 389, 153, 65, "请求 / state 元数据", "cu_seqlens · slots / indices", "序列边界、位置和状态索引供卷积、state 选取与递推使用。Decode 推测路径另使用已接受 token 数。", "meta"),
        node("history", 229, 389, 153, 65, "历史 cache", "conv state · recurrent state", "卷积状态与递推矩阵分开存储。递推状态每个 owner 的逻辑维度为 [12,128,128]。", "cache"),
        node("seed", 647, 389, 151, 65, decode ? "按索引取状态" : "准备初始状态", decode ? "state indices · accepted length" : "gather state · clear missing", decode ? "按 state indices 关联本步 query 与历史状态。推测窗口同时使用 accepted length。" : "根据 prefill_state_indices 取历史状态，并清除没有有效前缀的初始状态。", "cache"),
        node("write", 1110, 389, 160, 65, "本步 cache 更新", "conv / recurrent writeback", decode ? "卷积更新与 recurrent update 可原地写对应 state slots。校验后按已提交位置推进可见状态。" : "卷积与 chunk 更新输出的状态进入对应 slots，供后续 chunk 或 Decode 读取。", "cache"),
      ],
      edges: [
        edge("input", "project", "activation", "X [T,H]", undefined, [], [184,216]),
        edge("project", "conv", "activation", "QKV [T,1280]", undefined, [[393,216],[393,105]], [391,145]),
        edge("conv", "norm", "activation", "QKV", undefined, [], [602,105]),
        edge("norm", "core", "activation", "Q/K [T,4,128] · V [T,12,128]", ["r","l:-17"], [[827,105],[827,204]], [912,113]),
        edge("project", "gating", "gate", "a,b 各 [T,12]", undefined, [[392,216],[392,285]], [333,277]),
        edge("gating", "core", "gate", "g,β [T,12]", ["r","l:14"], [[829,285],[829,235]], [710,285]),
        edge("project", "outgate", "gate", "z [T,12,128]", ["b","b"], [[286.5,335],[1154,335]], [903,335]),
        edge("core", "outgate", "activation", "O [T,12,128]", undefined, [], [1056,162]),
        edge("outgate", "output", "activation", "O gated [T,1536]", undefined, [], [1250,270]),
        edge("history", "conv", "cache", "conv state[slot,…]", ["r:-12","b"], [[403,409.5],[403,167],[495,167]], [499,167]),
        edge("history", "seed", "cache", "S [slot,12,128,128]", undefined, [], [517,419]),
        edge("seed", "core", "cache", "S_init / state indices", ["t","b:-23"], [[722.5,360],[920,360]], [812,360]),
        edge("meta", "conv", "meta", "conv slots", ["r:-15","t"], [[192,406.5],[192,51],[495,51]], [307,51]),
        edge("meta", "seed", "meta", decode ? "state indices · accepted length" : "cu_seqlens · has_initial_state", ["b","b"], [[102.5,482],[722.5,482]], [437,482]),
        edge("meta", "core", "meta", "序列边界", ["b:32","b:-41"], [[134.5,503],[902,503]], [804,502]),
        edge("core", "write", "cache", "recurrent state′", ["b:21","t"], [[964,366],[1190,366]], [1082,366]),
        edge("conv", "write", "cache", "conv state′", ["t:32","r"], [[527,30],[1439,30],[1439,421.5]], [1106,30]),
      ],
    };
  }

  function qsaGraph(decode) {
    const edges = [
      edge("input", "qkv", "activation", "X [T,H]", undefined, [[189,231],[189,193]], [190,180]),
      edge("input", "indexproj", "activation", "同一 X [T,H]", undefined, [[189,231],[189,364.5]], [122,320]),
      edge("qkv", "qn", "activation", "Q [T,6,256]", undefined, [], [418,193]),
      edge("qkv", "kn", "activation", "K,V 各 [T,1,256]", ["t:22","l"], [[319.5,80.5]], [385,80]),
      edge("qkv", "out", "gate", "gate [T,6·256]", ["t:-25","t"], [[272.5,133],[1368,133]], [788,133]),
      edge("kn", "kvwrite", "activation", "K_rot, V", undefined, [], [636,80]),
      edge("kvwrite", "kvcache", "cache", "K,V → slots", undefined, [], [871,80]),
      edge("kvcache", "attn", "cache", "历史 + 本步 paged K/V", ["b","t"], [[995,151],[1174,151]], [1067,151]),
      edge("qn", "attn", "activation", "Q_rot [T,6,256]", ["r","l:-13"], [[1029,193],[1029,199.5]], [800,192]),
      edge("attn", "out", "activation", "O [T,6,256]", undefined, [], [1277,262]),
      edge("indexproj", "qi", "activation", "Q_i [T,4,128]", undefined, [], [408,318]),
      edge("qi", "topk", "activation", "Q_i rot [T,4,128]", undefined, [[623,365.5],[623,328.5]], [744,328]),
      edge("indexproj", "compress", "activation", "token K_i [T,1,128]", ["b","l:-11"], [[297.5,413],[640,413],[640,457]], [601,413]),
      edge("indexproj", "ring", "cache", "更新 raw key / pos", ["b:-23","l"], [[274.5,476]], [360,476]),
      edge("ring", "compress", "cache", "历史 K/pos", ["r","l:8"], [], [629,493]),
      edge("compress", "compcache", "cache", "compressed K_i", ["r:-8","l:12"], [[852,460],[852,459.5]], [853,403]),
      edge("compcache", "topk", "cache", "压缩 index keys", ["t","b"], [[952,391],[961,391]], [951,392]),
      edge("topk", "attn", "index", "indices [T,W]", ["r","b:-24"], [[1150,328.5]], [1085,332]),
      edge("meta", "topk", "meta", "token_to_req · logical positions", ["b","r:19"], [[100,520],[1049,520],[1049,347.5]], [740,520]),
      edge("meta", "attn", "meta", "seq_lens · block tables", ["b:37","b:41"], [[137,535],[1215,535]], [1114,535]),
      edge("meta", "kvwrite", "meta", "slot mapping", ["r:-9","t"], [[181,449],[181,29],[745,29]], [603,29]),
    ];
    if (!decode) {
      edges.push(edge("kn", "attn", "activation", "FIA 可用本步 K/V", ["b","l:-24"],
        [[530,115],[1084,115],[1084,188.5]], [934,121]));
    }
    return {
      height: 557,
      source: ascend + "models/qwen4_exp/qsa.py",
      note: decode
        ? "主 K/V 与 indexer 的 raw ring、compressed key 分开存放。纯 Decode metadata 路径用 GBSA 访问分页 K/V。"
        : "主 K/V 与 indexer 缓存分开存放。Prefill 根据请求阶段及逻辑 KV 长度选择 FIA 或 GBSA，FIA 可按条件使用本步 K/V。",
      nodes: [
        node("input", 26, 200, 140, 62, "Attention 输入", "HC mix · 单路 hidden", "X 同时供主 QKV 与 indexer Q/K 投影。后端可按条件打包投影。"),
        node("qkv", 220, 160, 155, 66, "主 QKV 投影", "Q / K / V + output gate", "TP4 下本地 Q 为 6 个 head，K/V 各 1 个 head，head dim 为 256。"),
        node("qn", 460, 160, 140, 66, "主 Q 处理", "RMSNorm · 部分 MRoPE", "对 Q 做归一化与部分旋转，保持 [T,6,256]。"),
        node("kn", 460, 48, 140, 65, "主 K/V 处理", "K norm / MRoPE · V 直通", "只对 K 执行相应归一化与旋转，V 沿主值路径传递。"),
        node("kvwrite", 670, 48, 150, 65, "分页 K/V 写入", "slot mapping · cache scatter", "将本步新 K/V 写入相应页和 slot。实际 fused prepare 可能合并投影后处理与写入。", "cache"),
        node("kvcache", 920, 48, 150, 65, "主 K/V cache", "paged KV · BLNHC", "Attention 按块表和有效长度读取主 K/V。该缓存与 indexer cache 分离。", "cache"),
        node("attn", 1100, 175, 148, 75, "QSA 稀疏注意力", decode ? "GenericBlockSparseAttention" : "GBSA / FIA · 请求选路", "用主 Q、主 K/V、稀疏索引及请求元数据计算局部注意力输出。"),
        node("out", 1305, 175, 126, 75, "门控 / 输出投影", "sigmoid gate · OProj", "局部结果使用 output gate 逐元素缩放，经行并行投影返回 [T,H]。"),
        node("indexproj", 220, 333, 155, 65, "Indexer Q/K 投影", "index_qk_proj · split", "从同一 X 生成 index query 和当前 token 的 raw index key。"),
        node("qi", 445, 334, 135, 63, "Indexer Q 处理", "RMSNorm · RoPE", "index query 逻辑形状为 [T,4,128]。本步骤与主 Q 归一化独立。"),
        node("ring", 452, 446, 132, 60, "Raw key ring", "近期 key · positions", "缓存近期 raw key 供压缩跨边界时读取。实现可同时存 RoPE 位置。", "cache"),
        node("compress", 675, 435, 153, 66, "压缩 Indexer key", "4:1 pooling · norm / RoPE", "使用本步 token key 和历史 ring 完成压缩组，对池化 key 归一化并旋转。", "cache"),
        node("compcache", 880, 415, 144, 65, "Compressed key cache", "压缩 index key · paged", "每个压缩条目使用 index head dim 128，由压缩后的槽位索引写入。", "cache"),
        node("topk", 895, 296, 132, 65, "Indexer 选块", "LightningIndexerV2", "根据 index query、compressed key 与可见长度输出紧凑稀疏索引。W 随请求与 kernel ABI 变化。", "index"),
        node("meta", 26, 421, 148, 74, "请求 / cache 元数据", "block tables · seq_lens · slots", "主 Attention 使用块表与有效长度。Indexer 另需 token_to_req、logical positions 及 raw / compressed 槽位信息。", "meta"),
      ],
      edges,
    };
  }

  function moeGraph(decode) {
    return {
      height: 474,
      source: ascend + "ops/fused_moe/token_dispatcher.py",
      note: "所有 48 层均使用 MoE。图按 routed / shared 的逻辑数据依赖展开，分发、专家计算和 shared merge 可随后端改变融合边界。",
      nodes: [
        node("residual", 24, 59, 140, 66, "Attention HC 状态", "多路 residual · injection", "Attention mix 返回的 HC 激活和 injection，等待与 Attention 输出结算。", "cache"),
        node("attention", 24, 187, 140, 65, "Attention 输出", "GDN / QSA · [T,H]", "GDN 或 QSA 的输出进入同一套 FFN 前 HC。"),
        node("hc", 225, 153, 164, 79, "FFN 前 HC", "combine_and_mix", "消费 residual、Attention 输出及其 injection，返回更新的多路 hidden、单路 X 以及 FFN 的 injection。"),
        node("route", 450, 62, 150, 68, "MoE Router", "Gate logits · TopK 10 / 512", "产生每 token 的 logits，并选出 routed expert IDs 与权重。", "gate"),
        node("dispatch", 670, 93, 153, 74, "EP token 分发", decode ? "MoeDistributeDispatchV3" : "EP dispatch · backend 选路", "用激活、expert IDs 和选路依赖打包行，并将它们发送到拥有目标 experts 的 rank。量化路径随包带 scale。", "index"),
        node("experts", 870, 93, 160, 74, "Routed expert FFN", "GroupedMatMul · SwiGLU · Down", "按 expert 分组计算本 rank 的 M 行，保留用于 combine 的顺序和分组映射。"),
        node("combine", 1090, 93, 157, 74, "EP 回传与汇合", decode ? "MoeDistributeCombineV3" : "EP combine · backend 选路", "使用权重、目标行映射和 recv counts 回传并聚合 routed 输出。backend 可能融合 shared 输出。", "index"),
        node("shared", 669, 291, 168, 73, "Shared expert", "Gate/Up · SwiGLU · Down", "同一个 FFN 输入直接进入共享专家，使用模型的 shared expert gate，产生 [T,H]。"),
        node("merge", 1090, 314, 157, 70, "Routed + Shared", "逻辑相加 / 融合输出", "汇合共享专家与已聚合 routed 输出，生成 MoeOut[T,H]。"),
        node("return", 1290, 314, 135, 70, "层出口", "延迟 HC 注入", "返回更新后的 HC residual、本层 MoE 输出及本层 FFN injection。普通层由下一层结算，末层由 final HC mixer 结算。", "cache"),
      ],
      edges: [
        edge("residual", "hc", "cache", "HC [T,R·H]", ["r:-8","l:-18"], [[195,84],[195,174.5]], [205,107]),
        edge("residual", "hc", "gate", "I_attn [T,R]", ["r:12","l:-5"], [[183,104],[183,187.5]], [109,151]),
        edge("attention", "hc", "activation", "A [T,H]", ["r","l:15"], [], [193,234]),
        edge("hc", "route", "activation", "X [T,H]", undefined, [[419,192.5],[419,96]], [405,141]),
        edge("hc", "dispatch", "activation", "X [T,H]", ["r:-12","l:24"], [[637,180.5],[637,154]], [513,179]),
        edge("route", "dispatch", "index", "ids [T,10]", ["r:-6","l:-21"], [[637,90],[637,109]], [638,46]),
        edge("route", "dispatch", "gate", "weights [T,10]", ["r:20","l:0"], [[647,116],[647,130]], [620,143]),
        edge("dispatch", "experts", "activation", "packed X [M,H]", ["r:-10","l:-10"], [], [849,77]),
        edge("dispatch", "experts", "meta", "group_list · scale", ["r:20","l:20"], [], [847,180]),
        edge("experts", "combine", "activation", "packed Y [M,H]", undefined, [], [1058,80]),
        edge("dispatch", "combine", "meta", "逆映射 · recv counts · routing weights", ["b","b"], [[746.5,226],[1168.5,226]], [956,226]),
        edge("hc", "shared", "activation", "X [T,H]", ["r:20","l"], [[526,212.5],[526,327.5]], [586,326]),
        edge("combine", "merge", "activation", "routed [T,H]", ["b:44","t:44"], [], [1213,270]),
        edge("shared", "merge", "activation", "shared [T,H]", undefined, [[1019,327.5],[1019,349]], [963,327]),
        edge("merge", "return", "activation", "MoE [T,H]", undefined, [], [1267,299]),
        edge("hc", "return", "cache", "更新后的 HC [T,R·H]", ["b:-12","b:-12"], [[295,423],[1345.5,423]], [741,423]),
        edge("hc", "return", "gate", "I_ffn [T,R]", ["b:16","b:16"], [[323,451],[1373.5,451]], [930,451]),
      ],
    };
  }

  const graphFor = { gdn: gdnGraph, qsa: qsaGraph, moe: moeGraph };

  function add(parent, tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    parent.append(element);
    return element;
  }

  function position(element, x, y) {
    element.style.left = x + "px";
    element.style.top = y + "px";
  }

  function point(port, box) {
    const [side, offset = "0"] = port.split(":");
    const n = Number(offset);
    if (side === "t") return [box.x + box.w / 2 + n, box.y];
    if (side === "b") return [box.x + box.w / 2 + n, box.y + box.h];
    const x = side === "l" ? box.x : box.x + box.w;
    return [x, box.y + box.h / 2 + n];
  }

  window.renderQwenTensorFlow = (root, initialFamily, initialStage) => {
    let family = initialFamily;
    let stage = initialStage;
    let current;
    let selected;
    let observer;
    let draw;
    const toolbar = add(root, "div", "tensor-toolbar");
    const buttons = [];

    function controls(options, get, set, label) {
      const wrapper = add(toolbar, "div", "switch");
      wrapper.setAttribute("role", "group");
      wrapper.setAttribute("aria-label", label);
      for (const [key, text] of Object.entries(options)) {
        const button = add(wrapper, "button", "", text);
        button.type = "button";
        buttons.push({ button, active: () => get() === key });
        button.addEventListener("click", () => { set(key); render(); });
      }
    }

    controls(families, () => family, key => { family = key; }, "算子类型");
    controls(stages, () => stage, key => { stage = key; }, "执行阶段");
    const reset = add(toolbar, "button", "outline-button tensor-reset", "显示全部连线");
    reset.type = "button";
    reset.addEventListener("click", () => { selected = null; refresh(); });
    const source = add(toolbar, "a", "text-link", "查看实现 ↗");
    source.target = "_blank";
    source.rel = "noopener";
    const legend = add(root, "div", "tensor-legend");
    for (const [title, color] of Object.values(types)) {
      const item = add(legend, "span", "", title);
      item.style.setProperty("--tensor-color", color);
    }

    const scroller = add(root, "div", "operator-scroll tensor-scroller");
    scroller.tabIndex = 0;
    scroller.setAttribute("aria-label", "tensor 数据流图，可横向滚动");
    const extent = add(scroller, "div", "operator-board-extent");
    const board = add(extent, "div", "tensor-board");
    const note = add(root, "p", "tensor-note");
    const inspector = add(root, "div", "tensor-inspector");
    inspector.setAttribute("aria-live", "polite");
    let nodeElements = new Map();
    let edgeElements = [];

    function refresh() {
      reset.disabled = !selected;
      for (const [id, element] of nodeElements) {
        const related = !selected || id === selected || current.edges.some(item =>
          (item.from === selected && item.to === id) || (item.to === selected && item.from === id));
        element.classList.toggle("is-dim", !related);
        element.setAttribute("aria-pressed", String(id === selected));
      }
      for (const [edge, label] of edgeElements) {
        label.classList.toggle("is-dim", !!selected && edge.from !== selected && edge.to !== selected);
      }
      inspector.replaceChildren();
      if (selected) {
        const entry = current.nodes.find(item => item.id === selected);
        add(inspector, "h3", "", entry.title);
        add(inspector, "p", "", entry.detail);
        const ul = add(inspector, "ul");
        for (const item of current.edges) {
          if (item.to === selected || item.from === selected) {
            const incoming = item.to === selected;
            const peer = current.nodes.find(node => node.id === (incoming ? item.from : item.to));
            add(ul, "li", "", (incoming ? "输入 · " : "输出 · ") + item.tensor + (incoming ? " ← " : " → ") + peer.title);
          }
        }
      }
      inspector.hidden = !selected;
      draw();
    }

    function render() {
      observer?.disconnect();
      current = graphFor[family](stage === "decode");
      selected = null;
      source.href = current.source;
      note.textContent = current.note;
      for (const { button, active } of buttons) button.setAttribute("aria-pressed", String(active()));
      board.replaceChildren();
      board.style.height = current.height + "px";
      const canvas = add(board, "canvas");
      canvas.setAttribute("aria-hidden", "true");
      const coordinates = new Map(current.nodes.map(box => [box.id, box]));
      nodeElements = new Map();
      edgeElements = [];
      const paths = current.edges.map(item => {
        const start = point(item.ports[0], coordinates.get(item.from));
        const end = point(item.ports[1], coordinates.get(item.to));
        const middle = (start[0] + end[0]) / 2;
        const turns = item.turns.length || start[0] === end[0] || start[1] === end[1]
          ? item.turns : [[middle, start[1]], [middle, end[1]]];
        if (item.label) {
          const tag = add(board, "span", "tensor-edge-label", item.tensor);
          tag.style.setProperty("--tensor-color", types[item.type][1]);
          position(tag, ...item.label);
          edgeElements.push([item, tag]);
        }
        return { item, points: [start, ...turns, end] };
      });
      for (const box of current.nodes) {
        const button = add(board, "button", "tensor-node");
        button.type = "button";
        button.setAttribute("aria-pressed", "false");
        button.dataset.tensorNode = box.id;
        button.style.setProperty("--tensor-color", types[box.tone][1]);
        position(button, box.x, box.y);
        button.style.width = box.w + "px";
        button.style.height = box.h + "px";
        add(button, "strong", "", box.title);
        add(button, "code", "", box.kernel);
        button.addEventListener("click", () => {
          selected = selected === box.id ? null : box.id;
          refresh();
        });
        nodeElements.set(box.id, button);
      }
      draw = () => {
        const viewport = scroller.clientWidth;
        if (!viewport) return;
        const scale = Math.min(1, Math.max(1050, viewport) / width);
        extent.style.width = Math.round(width * scale) + "px";
        extent.style.height = Math.ceil(current.height * scale) + "px";
        board.style.transform = "scale(" + scale + ")";
        const density = Math.min(window.devicePixelRatio || 1, 3);
        canvas.width = width * density;
        canvas.height = current.height * density;
        canvas.style.width = width + "px";
        canvas.style.height = current.height + "px";
        const ctx = canvas.getContext("2d");
        ctx.scale(density, density);
        for (const { item, points } of paths) {
          const [, color, dash] = types[item.type];
          ctx.globalAlpha = selected && item.from !== selected && item.to !== selected ? 0.18 : 1;
          ctx.strokeStyle = ctx.fillStyle = color;
          ctx.setLineDash(dash);
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
          ctx.stroke();
          const [x, y] = points.at(-1);
          const [a, b] = points.at(-2);
          const angle = Math.atan2(y - b, x - a);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - 7 * Math.cos(angle - .52), y - 7 * Math.sin(angle - .52));
          ctx.lineTo(x - 7 * Math.cos(angle + .52), y - 7 * Math.sin(angle + .52));
          ctx.closePath();
          ctx.fill();
        }
      };
      observer = new ResizeObserver(draw);
      observer.observe(scroller);
      scroller.scrollLeft = 0;
      refresh();
    }
    render();
    return () => observer?.disconnect();
  };
})();
