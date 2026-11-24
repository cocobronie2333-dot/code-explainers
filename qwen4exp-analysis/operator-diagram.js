"use strict";

(() => {
  const root = document.getElementById("operator-boards");
  const layerMap = document.getElementById("layer-map");
  const zoom = document.getElementById("operator-zoom");
  const dialog = document.getElementById("operator-detail");
  const details = document.getElementById("operator-detail-content");
  const tensorKind = {
    gproj: "gdn", conv: "gdn", gates: "gdn", gdn: "gdn", gout: "gdn",
    qproj: "qsa", qprep: "qsa", index: "qsa", kv: "qsa", qsa: "qsa", qout: "qsa",
    hcffn: "moe", route: "moe", shared: "moe", dispatch: "moe", experts: "moe", combine: "moe",
  };
  let disposeFlow;
  dialog.addEventListener("close", () => {
    if (dialog.open) return;
    disposeFlow?.();
    disposeFlow = null;
  });
  const width = 1600;
  const colors = {
    neutral: "#89a6bb", gdn: "#74bcff", qsa: "#bb9dff", ple: "#efc67c",
    moe: "#efc67c", comm: "#75da9f", mtp: "#ff88ab",
  };
  const upstream = "https://github.com/vllm-project/vllm/blob/c410543d9ffff03f5f6c4a8c0ae1d3ad082c4a15/vllm/";
  const ascend = "https://github.com/vllm-project/vllm-ascend/blob/c64ace678d12d5a48671d929c76f723f8158876c/vllm_ascend/";
  const model = upstream + "models/qwen4_exp/amd/model.py";
  const hc = ascend + "ops/triton/qwen4_exp/hc.py";
  const gdn = ascend + "ops/gdn.py";
  const qsa = ascend + "models/qwen4_exp/qsa.py";
  const mtp = ascend + "models/qwen4_exp/mtp.py";
  const dispatcher = ascend + "ops/fused_moe/token_dispatcher.py";
  const expert = ascend + "ops/fused_moe/fused_moe.py";
  // Exact Name field of the NPU Stream events in the rank 0 trace.
  const streamOperators = {
    prefill: {
      rows: 54911,
      nodes: {
        meta: ["_compute_slot_mappings_kernel"],
        gproj: ["aclnnMatmul_MatMulV3Common_MatMulV3"],
        conv: ["CausalConv1d"],
        gates: ["fused_gdn_gating_kernel"],
        gout: ["_layer_norm_fwd_1pass_kernel_npu", "aclnnMatmul_MatMulV3Common_MatMulV3"],
        qprep: ["_compress_qsa_groups_kernel"],
        index: ["LightningIndexerV2", "_pack_qsa_group_indices_kernel"],
        kv: ["_store_qsa_rows_kernel"],
        qsa: ["aclnnGenericBlockSparseAttention_GenericBlockSparseAttention_GenericBlockSparseAttention", "GenericBlockSparseAttentionMetadata"],
        qout: ["aclnnSigmoid_SigmoidAiCore_Sigmoid"],
        route: ["aclnnMoeGatingTopK_MoeGatingTopK_MoeGatingTopK", "aclnnMm_MatMulV3Common_MatMulV3"],
        shared: ["SwiGlu"],
        experts: ["aclnnGroupedMatmulSwigluQuantWeightNzV2_GroupedMatmulSwigluQuantV2_GroupedMatmulSwigluQuantV2", "aclnnGroupedMatmulWeightNz_GroupedMatmul_GroupedMatmul"],
        head: ["aclnnMatmul_MatMulV3Common_MatMulV3"],
        embed: ["aclnnEmbedding_GatherV2AiCore_GatherV2"],
        ple: ["_ple_conv_kernel", "_ple_ngram_ids_kernel", "_ple_gate_kernel"],
        hc: ["_hc_gate_mix_row_block_kernel"],
        hcffn: ["_hc_combine_norm_kernel"],
        final: ["_hc_gate_mix_row_block_kernel"],
        gdn: ["aclnnChunkGatedDeltaRuleFwd_ChunkFwdH_ChunkFwdH", "aclnnChunkGatedDeltaRuleFwd_ChunkGatedDeltaRuleFwdPrepare_ChunkGatedDeltaRuleFwdPrepare", "aclnnChunkGatedDeltaRuleFwd_ChunkFwdO_ChunkFwdO"],
        qproj: ["_triton_mrope_forward", "_qsa_rmsnorm_mrope_kernel"],
        dispatch: ["aclnnMoeInitRoutingV3_MoeInitRoutingV3_MoeInitRoutingV3"],
        combine: ["aclnnMoeTokenUnpermute_MoeFinalizeRoutingV2_MoeFinalizeRoutingV2", "aclnnForeachAddListV2_ForeachAddListV2_ForeachAddList"],
      },
      events: {
        "CausalConv1d": { streams: [59], calls: 576, share: 0.2474 },
        "GenericBlockSparseAttentionMetadata": { streams: [59], calls: 208, share: 0.6805 },
        "LightningIndexerV2": { streams: [59], calls: 208, share: 5.3102 },
        "SwiGlu": { streams: [59], calls: 800, share: 0.0453 },
        "_compress_qsa_groups_kernel": { streams: [59], calls: 208, share: 0.2728 },
        "_compute_slot_mappings_kernel": { streams: [59], calls: 16, share: 0.0009 },
        "_hc_combine_norm_kernel": { streams: [59], calls: 1552, share: 6.1692 },
        "_hc_gate_mix_row_block_kernel": { streams: [59], calls: 1600, share: 1.3058 },
        "_layer_norm_fwd_1pass_kernel_npu": { streams: [59], calls: 576, share: 0.1022 },
        "_pack_qsa_group_indices_kernel": { streams: [59], calls: 208, share: 0.1031 },
        "_ple_conv_kernel": { streams: [59], calls: 16, share: 0.2160 },
        "_ple_gate_kernel": { streams: [59], calls: 16, share: 0.1360 },
        "_ple_ngram_ids_kernel": { streams: [59], calls: 16, share: 0.0061 },
        "_qsa_rmsnorm_mrope_kernel": { streams: [59], calls: 416, share: 0.2874 },
        "_store_qsa_rows_kernel": { streams: [59], calls: 1040, share: 0.2189 },
        "_triton_mrope_forward": { streams: [59], calls: 192, share: 0.3583 },
        "aclnnChunkGatedDeltaRuleFwd_ChunkFwdH_ChunkFwdH": { streams: [59], calls: 576, share: 1.1423 },
        "aclnnChunkGatedDeltaRuleFwd_ChunkFwdO_ChunkFwdO": { streams: [59], calls: 576, share: 0.2142 },
        "aclnnChunkGatedDeltaRuleFwd_ChunkGatedDeltaRuleFwdPrepare_ChunkGatedDeltaRuleFwdPrepare": { streams: [59], calls: 576, share: 0.6481 },
        "aclnnEmbedding_GatherV2AiCore_GatherV2": { streams: [59], calls: 48, share: 0.0117 },
        "aclnnForeachAddListV2_ForeachAddListV2_ForeachAddList": { streams: [59], calls: 784, share: 0.1300 },
        "aclnnGenericBlockSparseAttention_GenericBlockSparseAttention_GenericBlockSparseAttention": { streams: [59], calls: 208, share: 63.3938 },
        "aclnnGroupedMatmulSwigluQuantWeightNzV2_GroupedMatmulSwigluQuantV2_GroupedMatmulSwigluQuantV2": { streams: [59], calls: 768, share: 1.3226 },
        "aclnnGroupedMatmulWeightNz_GroupedMatmul_GroupedMatmul": { streams: [59], calls: 768, share: 0.7249 },
        "aclnnMatmul_MatMulV3Common_MatMulV3": { streams: [59], calls: 7392, share: 5.1924 },
        "aclnnMm_MatMulV3Common_MatMulV3": { streams: [59], calls: 784, share: 0.2593 },
        "aclnnMoeGatingTopK_MoeGatingTopK_MoeGatingTopK": { streams: [59], calls: 784, share: 0.4764 },
        "aclnnMoeInitRoutingV3_MoeInitRoutingV3_MoeInitRoutingV3": { streams: [59], calls: 784, share: 1.0741 },
        "aclnnMoeTokenUnpermute_MoeFinalizeRoutingV2_MoeFinalizeRoutingV2": { streams: [59], calls: 784, share: 0.4168 },
        "aclnnSigmoid_SigmoidAiCore_Sigmoid": { streams: [59], calls: 992, share: 0.0334 },
        "fused_gdn_gating_kernel": { streams: [59], calls: 576, share: 0.1702 },
      },
    },
    decode: {
      rows: 77994,
      nodes: {
        meta: ["_compute_slot_mappings_kernel"],
        gproj: ["aclnnMatmul_MatMulV3Common_MatMulV3"],
        conv: ["CausalConv1d"],
        gates: ["fused_gdn_gating_kernel", "l2norm_fwd_kernel2"],
        gout: ["_layer_norm_fwd_1pass_kernel_npu", "aclnnMatmul_MatMulV3Common_MatMulV3"],
        qprep: ["_compress_qsa_groups_kernel"],
        index: ["LightningIndexerV2", "_pack_qsa_group_indices_kernel"],
        kv: ["_store_qsa_rows_kernel"],
        qsa: ["aclnnGenericBlockSparseAttention_GenericBlockSparseAttention_GenericBlockSparseAttention"],
        qout: ["aclnnQuantMatmulWeightNz_QuantBatchMatmulV3_QuantBatchMatmulV3", "aclnnSigmoid_SigmoidAiCore_Sigmoid"],
        route: ["aclnnMoeGatingTopK_MoeGatingTopK_MoeGatingTopK", "aclnnMm_MatMulV3Common_MatMulV3"],
        shared: ["SwiGlu"],
        experts: ["aclnnGroupedMatmulSwigluQuantWeightNzV2_GroupedMatmulSwigluQuantV2_GroupedMatmulSwigluQuantV2", "aclnnGroupedMatmulWeightNz_GroupedMatmul_GroupedMatmul"],
        head: ["aclnnMatmul_MatMulV3Common_MatMulV3"],
        embed: ["aclnnEmbedding_EmbeddingAiCore_Embedding"],
        ple: ["_ple_conv_spec_kernel", "_ple_ngram_ids_kernel", "_ple_gate_kernel"],
        hc: ["_hc_gate_mix_kernel"],
        hcffn: ["_hc_combine_norm_kernel"],
        final: ["_hc_gate_mix_kernel"],
        gdn: ["aclnnRecurrentGatedDeltaRule_RecurrentGatedDeltaRule_RecurrentGatedDeltaRule"],
        qproj: ["_triton_rope", "RmsNorm"],
        dispatch: ["MoeDistributeDispatchV3"],
        combine: ["MoeDistributeCombineV3", "aclnnForeachAddListV2_ForeachAddListV2_ForeachAddList"],
        mtpIn: ["aclnnAdd_AddAiCore_Add"],
        draftLayer: ["aclnnGenericBlockSparseAttention_GenericBlockSparseAttention_GenericBlockSparseAttention"],
        draftHead: ["aclnnArgMax_ArgMaxV2AiCore_ArgMaxV2"],
        verify: ["_probabilistic_rejection_kernel", "_resample_kernel"],
        commit: ["_post_update_kernel", "_scatter_num_accepted_kernel", "postprocess_mamba_fused_kernel"],
      },
      events: {
        "CausalConv1d": { streams: [59], calls: 648, share: 1.2859 },
        "LightningIndexerV2": { streams: [59], calls: 306, share: 1.7945 },
        "MoeDistributeCombineV3": { streams: [59], calls: 954, share: 2.4808 },
        "MoeDistributeDispatchV3": { streams: [59], calls: 954, share: 3.8059 },
        "RmsNorm": { streams: [59], calls: 1404, share: 1.1841 },
        "SwiGlu": { streams: [59], calls: 1044, share: 0.6455 },
        "_compress_qsa_groups_kernel": { streams: [59], calls: 306, share: 0.3431 },
        "_compute_slot_mappings_kernel": { streams: [59], calls: 90, share: 0.0693 },
        "_hc_combine_norm_kernel": { streams: [59], calls: 1890, share: 1.6423 },
        "_hc_gate_mix_kernel": { streams: [59], calls: 2016, share: 1.4273 },
        "_layer_norm_fwd_1pass_kernel_npu": { streams: [59], calls: 648, share: 0.6335 },
        "_pack_qsa_group_indices_kernel": { streams: [59], calls: 306, share: 0.2319 },
        "_ple_conv_spec_kernel": { streams: [59], calls: 18, share: 0.0335 },
        "_ple_gate_kernel": { streams: [59], calls: 18, share: 0.0269 },
        "_ple_ngram_ids_kernel": { streams: [59], calls: 18, share: 0.0322 },
        "_post_update_kernel": { streams: [59], calls: 18, share: 0.0231 },
        "_probabilistic_rejection_kernel": { streams: [59], calls: 18, share: 0.0293 },
        "_resample_kernel": { streams: [59], calls: 18, share: 0.0328 },
        "_scatter_num_accepted_kernel": { streams: [59], calls: 18, share: 0.0094 },
        "_store_qsa_rows_kernel": { streams: [59], calls: 1224, share: 0.6243 },
        "_triton_rope": { streams: [59], calls: 306, share: 0.2711 },
        "aclnnAdd_AddAiCore_Add": { streams: [59], calls: 1170, share: 0.4895 },
        "aclnnArgMax_ArgMaxV2AiCore_ArgMaxV2": { streams: [59], calls: 90, share: 0.1060 },
        "aclnnEmbedding_EmbeddingAiCore_Embedding": { streams: [59], calls: 108, share: 0.0676 },
        "aclnnForeachAddListV2_ForeachAddListV2_ForeachAddList": { streams: [59], calls: 954, share: 1.0605 },
        "aclnnGenericBlockSparseAttention_GenericBlockSparseAttention_GenericBlockSparseAttention": { streams: [59], calls: 306, share: 2.4457 },
        "aclnnGroupedMatmulSwigluQuantWeightNzV2_GroupedMatmulSwigluQuantV2_GroupedMatmulSwigluQuantV2": { streams: [59], calls: 864, share: 6.1696 },
        "aclnnGroupedMatmulWeightNz_GroupedMatmul_GroupedMatmul": { streams: [59], calls: 864, share: 4.3103 },
        "aclnnMatmul_MatMulV3Common_MatMulV3": { streams: [59], calls: 9504, share: 16.0570 },
        "aclnnMm_MatMulV3Common_MatMulV3": { streams: [59], calls: 954, share: 1.0265 },
        "aclnnMoeGatingTopK_MoeGatingTopK_MoeGatingTopK": { streams: [59], calls: 954, share: 0.7362 },
        "aclnnQuantMatmulWeightNz_QuantBatchMatmulV3_QuantBatchMatmulV3": { streams: [59], calls: 864, share: 1.2641 },
        "aclnnRecurrentGatedDeltaRule_RecurrentGatedDeltaRule_RecurrentGatedDeltaRule": { streams: [59], calls: 648, share: 1.7080 },
        "aclnnSigmoid_SigmoidAiCore_Sigmoid": { streams: [59], calls: 1260, share: 0.6520 },
        "fused_gdn_gating_kernel": { streams: [59], calls: 648, share: 1.4071 },
        "l2norm_fwd_kernel2": { streams: [59], calls: 1296, share: 0.7155 },
        "postprocess_mamba_fused_kernel": { streams: [59], calls: 18, share: 0.0147 },
      },
    },
  };

  const stages = {
    prefill: {
      label: "PREFILL",
      configuration: "950DT 114 · W8A8 · P 端 TP4 / DP1 / EP4 · eager · chunked prefill",
      evidence: "114 Prefill A · rank 0",
      gdnTitle: "GDN 分块递推",
      gdnKernel: "ChunkFwdH",
      gdnDescription: "按 chunk 更新状态并输出 token 结果。有命中前缀时使用可用的历史状态，沿执行路径写回新状态。",
      convKernel: "CausalConv1d",
      attentionKernel: "GBSA / FIA",
      attentionDescription: "按请求阶段与逻辑 KV 长度选路。短区间可走 FIA，后续区间可走 GBSA。",
    },
    decode: {
      label: "DECODE",
      configuration: "950DT 104 · W8A8 · TP4 / DP1 / EP4 · eager 单实例 · MTP5",
      evidence: "104 128K C1 Decode · rank 0",
      gdnTitle: "GDN 增量递推",
      gdnKernel: "RecurrentGatedDeltaRule",
      gdnDescription: "读取已保存的递推状态，按本步 token 逐步更新。推测路径按状态索引保存候选状态，后续依据校验结果推进。",
      convKernel: "CausalConv1d · state update",
      attentionKernel: "GBSA",
      attentionDescription: "纯 Decode metadata 走 GBSA，以当前查询访问已有 paged K/V。验证多个推测 token 时，本步可有多行查询。",
    },
  };

  function describe(stage) {
    const spec = stages[stage];
    return {
      embed: ["词嵌入与 HC 展开", "VocabParallelEmbedding · HC expand", "输入 ids[T]，查词表得到 [T,H]，然后展开为 R 路 [T,R·H]。词表并行按部署汇集结果。", model],
      ple: ["L1 · PLE 注入", "n-gram 查表 · 门控 · short-conv", "模型配置的第 2 层对应 0 基 L1。先结算上一层延迟的 HC combine，再以 token / 历史 n-gram 产生特征并注入 HC streams。PLE 独立维护 short-conv 状态。", ascend + "models/qwen4_exp/ple.py"],
      hc: ["注意力输入混合", "RMSNorm · 低秩门控", "用 4 路 HC 激活生成单路 Attention 输入 [T,H] 和 injection。普通层可将上一层的延迟 combine 与当前 mix 融合。", hc],
      meta: ["缓存槽位与元数据", "seq_lens · positions · slot mapping", "为短卷积、GDN 递推或 QSA 准备当前批次的请求位置、状态索引和块表。元数据线表示其中用于 QSA 的依赖。", ascend + "models/qwen4_exp/model_state.py"],
      gproj: ["GDN 输入投影", "QKV / z · a / b", "Q/K/V 主路径由线性投影生成。z 进入输出门控，a 和 b 用于衰减与更新参数。TP4 每 rank 的 Q/K/V 合计宽度为 1280。", gdn],
      conv: ["因果短卷积", spec.convKernel, "仅对 Q/K/V 主路径做宽度 4 的因果卷积。读取历史 conv state，保留本步更新后的卷积状态。实现可随 token 路径选择融合或回退分支。", gdn],
      gates: ["归一化 / 递推参数", "Q/K L2 · 衰减 g · β", "拆出 TP4 局部 Q、K、V。局部 Q/K 为 [T,4,128]，V 为 [T,12,128]。递推所需的 Q/K L2、衰减与 β 可由实际递推 kernel 融合。", gdn],
      gdn: [spec.gdnTitle, spec.gdnKernel, spec.gdnDescription + " 每 rank 递推矩阵的逻辑形状为每 owner [12,128,128]，具体 state slot 管理受缓存与 MTP 配置影响。", gdn],
      gout: ["门控归一化与输出投影", "Gated RMSNorm · OProj", "GDN 得到局部 [T,12,128] 输出，经 z 门控归一化和行并行输出投影，返回 [T,H]。需要时由 TP 通信汇集局部计算结果。", gdn],
      qproj: ["QKV 投影与位置编码", "Q/K RMSNorm · 部分 MRoPE", "从 [T,H] 产生 Q/K/V、输出 gate 与 indexer 所需投影。TP4 的 Q 为 [T,6,256]，K/V 各 [T,1,256]。融合条件由目标 / 草稿和 Ascend 后端配置决定。", qsa],
      qprep: ["索引键压缩", "raw ring · pooling · norm / RoPE", "indexer 更新 raw key ring。在达到压缩边界时汇聚 key，并写入 compressed index cache。压缩比例为 4，TP4 局部 index query 为 [T,4,128]。", qsa],
      index: ["稀疏索引选块", "LightningIndexerV2", "比较 index query 与 compressed keys，构造稀疏注意力索引。W 是传入注意力 kernel 的有效索引维度，随请求和 ABI 变化。", ascend + "models/qwen4_exp/lightning_indexer.py"],
      kv: ["QSA K/V 写入", "paged K/V · slot mapping", "本步新 K/V 写入 BLNHC 分配的页缓存。缓存与 indexer 的 raw / compressed 区域分别描述。Attention 读取当前和历史位置。", qsa],
      qsa: ["QSA 块稀疏注意力", spec.attentionKernel, spec.attentionDescription + " 使用 Q、稀疏索引与所需 K/V，得到 [T,6,256] 局部注意力输出。", ascend + "models/qwen4_exp/attention_dispatch.py"],
      qout: ["QSA 门控与输出投影", "sigmoid gate · OProj", "对局部注意力输出应用 sigmoid gate，再输出投影并按 TP 路径汇集结果，得到 [T,H] 返回给 FFN 的 HC。", qsa],
      hcffn: ["注意力输出混合与归一化", "combine_and_mix", "将 Attention 输出注入 4 路 HC，再生成本层 MoE 输入 [T,H] 与本层 FFN 的 injection。普通层可把 MoE 输出和 injection 留到下一层结算。", hc],
      route: ["专家路由 · 512 选 10", "512 选 10 · gate", "Router 对每 token 产生 512 个 routed expert 分数，选出 10 个及对应权重。输入同时走 shared expert 分支。", model],
      shared: ["共享专家激活", "Gate / Up · SwiGLU · Down", "从同一个 FFN 输入 [T,H] 计算共享专家输出，与 routed experts 的加权结果合并。后端可选择不同的融合与通信路径。", model],
      dispatch: [stage === "decode" ? "EP 令牌分发" : "路由展开与令牌重排", stage === "decode" ? "MoeDistributeDispatchV3" : "dispatch · token packing", "依路由结果整理 token。Prefill 采集中此事件负责路由展开与令牌重排，Decode 采集中此事件负责 EP 分发。M 为本 rank 的路由行数。", dispatcher],
      experts: ["路由专家分组计算", "GroupedMatmulSwigluQuantV2", "本地专家执行分组 Gate/Up 投影、激活门控与 Down 投影。", expert],
      combine: [stage === "decode" ? "EP 回收与共享专家汇合" : "恢复顺序与专家汇合", stage === "decode" ? "MoeDistributeCombineV3" : "combine · shared merge", "汇回路由专家结果并应用 router 权重，再合并 shared expert 输出。普通层把多路 hidden、本层 MoE 输出及 injection 交给下一层。", dispatcher],
      final: ["末层 HC 混合", "combine_and_mix · pre-mixer 保存", "在最后一层结算 FFN 的延迟注入，生成采样用的 [T,H]。启用 MTP 时保存 mix 前的 4 路 hidden，为 draft 输入提供 [T,R·H]。", model],
      head: ["词表投影与采样", "Logits [T_sel,V]", "对调度器所需的行执行词表投影，采样 token 或提供校验用 logits。T_sel 为当前选择的行数，V 为 248320。", model],
      mtpIn: ["草稿输入融合", "Embedding / HC Hidden · Norm + FC", "将已采样 token 的 embedding 分支与目标 pre-mixer hidden 的 HC 分支分别归一化、投影，随后广播相加，得到 draft 的 4 路激活。", mtp],
      draftLayer: ["草稿层块稀疏注意力", "HC · QSA · MoE · HC mixer", "MTP 配置包含 1 个 QSA decoder layer。每轮提议可多次使用该层，draft 采用自己的 QSA metadata 与状态。", mtp],
      draftHead: ["候选生成 · 最多 5 个", "Draft LM Head · 提议迭代", "Draft LM Head 产生候选。MTP5 表示每个请求最多提议 5 个 token。提议过程中也更新供下一次 draft 调用的多路 hidden。", mtp],
      verify: ["候选校验与拒绝采样", "48 层 Target · RejectionSampler", "把候选打包给上方 Decode target 路径，计算校验 logits。调度器按接受长度选定要提交的 token。", upstream + "v1/sample/rejection_sampler.py"],
      commit: ["提交 / 下一轮", "accept_len · token IDs · state", "提交接受的候选及适用的采样 token，并按提交位置更新可见 KV、GDN 状态与调度元数据，进入下一轮 Decode。", "https://docs.vllm.ai/en/latest/features/spec_decode/"],
    };
  }

  function renderBoard(stage) {
    const decoding = stage === "decode";
    const stageInfo = stages[stage];
    const nodes = describe(stage);
    const height = decoding ? 675 : 472;
    const section = add(root, "section", "operator-stage " + (decoding ? "d-stage" : "p-stage"));
    const heading = add(section, "header");
    const headingId = "operator-" + stage + "-title";
    add(heading, "h2", "", stageInfo.label).id = headingId;
    section.setAttribute("aria-labelledby", headingId);
    add(heading, "p", "", stageInfo.configuration);
    const scroller = add(section, "div", "operator-scroll");
    scroller.tabIndex = 0;
    scroller.setAttribute("aria-label", stageInfo.label + " 算子图，可横向滚动");
    const extent = add(scroller, "div", "operator-board-extent");
    const board = add(extent, "div", "operator-board");
    board.style.height = height + "px";
    const boxes = new Map();
    const wires = [];

    function place(element, x, y, w, h) {
      element.style.left = x + "px";
      element.style.top = y + "px";
      if (w) element.style.width = w + "px";
      if (h) element.style.height = h + "px";
    }

    function group(tone, name, x, y, w, h) {
      const item = add(board, "div", "operator-group");
      item.dataset.tone = tone;
      place(item, x, y, w, h);
      add(item, "h3", "", name);
    }

    function lane(tone, name, x, y) {
      const title = add(board, "p", "operator-lane-title", name);
      title.dataset.tone = tone;
      place(title, x, y);
    }

    function box(id, tone, x, y, w, h, branch) {
      boxes.set(id, { x, y, w, h });
      const node = nodes[id];
      const button = add(board, "button", "operator-box");
      button.type = "button";
      button.dataset.tone = tone;
      button.dataset.node = id;
      if (branch) button.dataset.branch = branch;
      place(button, x, y, w, h);
      const trace = streamOperators[stage];
      const names = trace.nodes[id];
      const mainName = names[0];
      const nameLabel = add(button, "code", "operator-stream-name", mainName);
      if (mainName.length > 40) nameLabel.classList.add("long-name");
      add(button, "span", "operator-caption", node[0]);
      if (id === "index" || !decoding && id === "gdn" || decoding && ["dispatch", "combine"].includes(id)) {
        add(button, "small", "", "trace " + trace.events[mainName].share.toFixed(2) + "%");
      }
      button.title = names.join(" · ") + " · " + node[0];
      button.addEventListener("click", () => {
        const kind = id === "hc" ? (activeLayer !== null && activeLayer % 4 === 3 ? "qsa" : "gdn") : tensorKind[id];
        openDetail(stage, node, names, kind);
      });
    }

    const canvas = add(board, "canvas");
    canvas.setAttribute("aria-hidden", "true");

    const left = id => { const { x, y, h } = boxes.get(id); return [x, y + h / 2]; };
    const right = id => { const { x, y, w, h } = boxes.get(id); return [x + w, y + h / 2]; };
    const top = id => { const { x, y, w } = boxes.get(id); return [x + w / 2, y]; };
    const bottom = id => { const { x, y, w, h } = boxes.get(id); return [x + w / 2, y + h]; };
    const wire = (tone, points, arrow = true, dashed = false, branch) => wires.push({ tone, points, arrow, dashed, branch });
    const chain = (tone, ids) => ids.slice(1).forEach((id, index) => wire(tone, [right(ids[index]), left(id)], true, false, tone));

    function badge(label, x, y, anchor) {
      const element = add(board, "span", "operator-shape-badge", label);
      place(element, x, y);
      if (anchor) wire("neutral", [anchor, [x, y]], false);
    }

    group("neutral", "48 × Decoder Layer · Attention 分支按层选择", 370, 33, 694, 404);
    group("moe", "每层 FFN · Routed + Shared", 1078, 33, 280, 404);
    lane("gdn", "36 × GDN · " + (decoding ? "增量状态更新" : "按 chunk 更新状态"), 387, 78);
    lane("qsa", "12 × QSA · 稀疏索引 + paged K/V", 387, 241);

    box("embed", "neutral", 24, 176, 138, 78);
    box("ple", "ple", 196, 77, 144, 72, "ple");
    box("hc", "neutral", 196, 176, 144, 78);
    box("meta", "mtp", 24, 309, 138, 75);
    const gdnLane = ["gproj", "conv", "gates", "gdn", "gout"];
    const qsaLane = ["qproj", "qprep", "index", "qsa", "qout"];
    const columns = [387, 520, 653, 786, 919];
    gdnLane.forEach((id, index) => box(id, "gdn", columns[index], 99, 114, 80, "gdn"));
    qsaLane.forEach((id, index) => box(id, "qsa", columns[index], 258, 114, 88, "qsa"));
    box("kv", "qsa", 520, 386, 190, 47, "qsa");

    box("hcffn", "neutral", 1090, 77, 255, 68);
    box("route", "moe", 1090, 176, 121, 58);
    box("shared", "moe", 1224, 179, 121, 121);
    box("dispatch", "comm", 1090, 251, 121, 65);
    box("experts", "moe", 1090, 329, 121, 88);
    box("combine", "comm", 1224, 329, 121, 88);
    box("final", "neutral", 1400, 146, 171, 78);
    box("head", "neutral", 1400, 264, 171, 76);

    wire("neutral", [right("embed"), left("hc")]);
    wire("ple", [[177, 215], [177, 113], left("ple")], true, true, "ple");
    wire("ple", [bottom("ple"), top("hc")], true, true, "ple");
    badge("[T,R·H]", 179, 270, [179, 215]);
    wire("gdn", [right("hc"), [351, 215], [351, 139], left("gproj")], true, false, "gdn");
    wire("qsa", [right("hc"), [351, 215], [351, 302], left("qproj")], true, false, "qsa");
    badge("[T,H]", 364, 215, [351, 215]);
    chain("gdn", gdnLane);
    chain("qsa", qsaLane);
    badge("[T,1280] + 门控", 508, 193, [508, 139]);
    badge("Q,K,V", 642, 193, [642, 139]);
    badge("Q,K,V + g,β", 775, 193, [775, 139]);
    badge("[T,12,128]", 909, 193, [909, 139]);
    wire("gdn", [bottom("gproj"), [444, 209], [976, 209], bottom("gout")], true, true, "gdn");
    badge("z [T,12,128]", 978, 209);

    wire("qsa", [top("qproj"), [444, 219], [843, 219], top("qsa")], true, false, "qsa");
    badge("Q [T,6,256]", 694, 219);
    wire("qsa", [bottom("qproj"), [444, 409.5], left("kv")], true, false, "qsa");
    wire("qsa", [right("kv"), [843, 409.5], bottom("qsa")], true, false, "qsa");
    wire("qsa", [[444, 373], [976, 373], bottom("qout")], true, true, "qsa");
    badge("[T,4,128]", 508, 356, [508, 302]);
    badge("compressed keys", 642, 356, [642, 302]);
    badge("indices [T,W]", 775, 356, [775, 302]);
    badge("[T,6,256]", 909, 356, [909, 302]);
    badge("gate [T,6·256]", 977, 373);
    badge("K,V 各 [T,1,256]", 444, 420);
    wire("mtp", [right("meta"), [176, 346.5], [176, 444], [750, 444], [750, 373], [710, 373], bottom("index")], true, true);
    badge("seq[B] · block table", 313, 444);

    wire("gdn", [right("gout"), [1051, 139], [1051, 111], left("hcffn")], true, false, "gdn");
    wire("qsa", [right("qout"), [1051, 302], [1051, 111], left("hcffn")], true, false, "qsa");
    badge("[T,H]", 1051, 237);
    const ffnX = bottom("hcffn")[0];
    for (const id of ["route", "shared"]) {
      wire(id === "route" ? "moe" : "neutral", [bottom("hcffn"), [ffnX, 163], [top(id)[0], 163], top(id)]);
    }
    wire("comm", [bottom("route"), top("dispatch")]);
    wire("comm", [bottom("dispatch"), top("experts")]);
    wire("comm", [right("experts"), left("combine")]);
    wire("moe", [bottom("shared"), top("combine")]);
    badge("ids [T,10]", 1201, 241, [1150.5, 241]);
    badge("[M,H]", 1186, 320, [1150.5, 320]);
    const lastX = right("combine")[0] + 34;
    const lastY = right("combine")[1];
    wire("comm", [right("combine"), [lastX, lastY], [lastX, 185], left("final")]);
    wire("neutral", [[lastX, lastY], [lastX, 459], [268, 459], bottom("hc")], true, true);
    badge("下一层 · HC [T,R·H] + MoE [T,H] + injection", 971, 459);
    badge("末层", 1384, 214);
    wire("neutral", [bottom("final"), top("head")]);
    badge("[T,H]", 1485.5, 242);

    if (decoding) {
      group("mtp", "推测解码 · MTP5", 24, 479, 1544, 159);
      const sequence = ["mtpIn", "draftLayer", "draftHead", "verify", "commit"];
      sequence.forEach((id, index) => box(id, "mtp", 188 + index * 263, 540, 212, 63));
      chain("mtp", sequence);
      wire("mtp", [right("final"), [1583, 185], [1583, 512], [294, 512], top("mtpIn")]);
      wire("mtp", [right("head"), [1583, 302]], false);
      badge("已采样 ids + pre-mixer HC [T,R·H]", 1316, 512);
      badge("[T,R·H]", 425, 620, [425, 571.5]);
      badge("draft logits", 689, 620, [689, 571.5]);
      badge("候选 ≤ 5 / 请求", 952, 620, [952, 571.5]);
      badge("accept_len [B]", 1215, 620, [1215, 571.5]);
      wire("mtp", [right("commit"), [1480, 571.5], [1480, 656], [13, 656], [13, 215], left("embed")], true, true);
      badge("提交 ids → 下一轮", 229, 656);
    }

    let selectedBranch = null;
    let selectedPle = false;

    function draw() {
      const viewport = scroller.clientWidth;
      if (!viewport) return;
      const scale = zoom.getAttribute("aria-pressed") === "true" ? 1 :
        Math.min(1, Math.max(1120, viewport) / width);
      extent.style.width = Math.round(width * scale) + "px";
      extent.style.height = Math.ceil(height * scale) + "px";
      board.style.transform = "scale(" + scale + ")";
      const density = Math.min(3, window.devicePixelRatio || 1);
      canvas.width = width * density;
      canvas.height = height * density;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      const ctx = canvas.getContext("2d");
      ctx.scale(density, density);
      for (const { tone, points, arrow, dashed, branch } of wires) {
        const isDimmed = branch && selectedBranch && branch !== selectedBranch && !(selectedPle && branch === "ple");
        ctx.globalAlpha = isDimmed ? .33 : 1;
        ctx.strokeStyle = colors[tone];
        ctx.fillStyle = colors[tone];
        ctx.lineWidth = !arrow ? 0.8 : 1.7;
        ctx.setLineDash(dashed ? [5, 4] : []);
        ctx.beginPath();
        points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.stroke();
        if (!arrow) continue;
        const [x, y] = points.at(-1);
        const [a, b] = points.at(-2);
        const angle = Math.atan2(y - b, x - a);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 7 * Math.cos(angle - .55), y - 7 * Math.sin(angle - .55));
        ctx.lineTo(x - 7 * Math.cos(angle + .55), y - 7 * Math.sin(angle + .55));
        ctx.closePath();
        ctx.fill();
      }
    }

    const observer = new ResizeObserver(draw);
    observer.observe(scroller);
    draw();
    return {
      draw,
      highlight(kind, ple) {
        selectedBranch = kind;
        selectedPle = ple;
        board.classList.toggle("has-layer", kind !== null);
        for (const element of board.querySelectorAll("[data-branch]")) {
          element.classList.toggle("is-layer", element.dataset.branch === kind || (ple && element.dataset.branch === "ple"));
        }
        draw();
      },
    };
  }

  function add(parent, tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content) node.textContent = content;
    parent.append(node);
    return node;
  }

  function openDetail(stage, [title, kernel, description, source], names, kind) {
    disposeFlow?.();
    disposeFlow = null;
    details.replaceChildren();
    dialog.classList.toggle("has-tensor-flow", Boolean(kind));
    add(details, "p", "eyebrow", kind ? "ASCEND 950DT · W8A8" : stages[stage].label);
    add(details, "h2", "", kind ? "Qwen4Exp · 算子 tensor 数据流" : names[0]).id = "operator-dialog-title";
    let operator = details;
    if (kind) {
      disposeFlow = window.renderQwenTensorFlow(add(details, "div", "tensor-flow"), kind, stage);
      operator = add(details, "details", "tensor-original-detail");
      add(operator, "summary", "", "所点算子 · " + title);
    }
    if (!kind) add(operator, "h3", "", title);
    add(operator, "p", "", description);
    const fields = add(operator, "dl");
    function field(label, value, code) {
      const row = add(fields, "div");
      add(row, "dt", "", label);
      const desc = add(row, "dd");
      if (code) add(desc, "code", "", value);
      else desc.textContent = value;
    }
    if (!names.includes(kernel)) field("执行路径", kernel, true);
    const trace = streamOperators[stage];
    for (const name of names) {
      const { streams, calls, share } = trace.events[name];
      field("NPU Stream " + streams.join(" / "), name, true);
      field("同名事件", calls.toLocaleString("en-US") + " 次 · 累计 " + share.toFixed(2) + "%");
    }
    field("采样窗口", stages[stage].evidence + " · " + trace.rows.toLocaleString("en-US") + " 条记录");
    const link = add(operator, "a", "text-link", "查看源码 ↗");
    link.href = source;
    link.target = "_blank";
    link.rel = "noopener";
    dialog.showModal();
  }

  const diagrams = [renderBoard("prefill"), renderBoard("decode")];
  let activeLayer = null;
  for (let index = 0; index < 48; index++) {
    const kind = index % 4 === 3 ? "qsa" : "gdn";
    const button = add(layerMap, "button", "", String(index));
    button.type = "button";
    button.dataset.tone = index === 1 ? "ple" : kind;
    button.setAttribute("aria-label", "L" + index + " " + kind.toUpperCase() + (index === 1 ? " + PLE" : ""));
    button.setAttribute("aria-pressed", "false");
    add(button, "span", "", index === 1 ? "G+P" : kind === "qsa" ? "Q" : "G");
    button.addEventListener("click", () => {
      const previous = layerMap.querySelector('[aria-pressed="true"]');
      if (previous) previous.setAttribute("aria-pressed", "false");
      activeLayer = activeLayer === index ? null : index;
      button.setAttribute("aria-pressed", String(activeLayer !== null));
      for (const diagram of diagrams) diagram.highlight(activeLayer === null ? null : kind, activeLayer === 1);
      document.getElementById("layer-caption").textContent = activeLayer === null
        ? "层号从 0 开始。点击层号可在两张图里对照其 Attention 分支。"
        : "L" + index + " · " + kind.toUpperCase() + (index === 1 ? " · Attention 前注入 PLE" : "");
    });
  }
  zoom.addEventListener("click", () => {
    const full = zoom.getAttribute("aria-pressed") === "false";
    zoom.setAttribute("aria-pressed", String(full));
    zoom.textContent = full ? "适应宽度" : "原尺寸";
    for (const diagram of diagrams) diagram.draw();
  });
})();
