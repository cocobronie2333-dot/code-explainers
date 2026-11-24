"use strict";

window.qwenValidation = {
  "context": "Ascend 950DT · 单实例混部 · NPU 4–7 · TP4 + EP · W8A8 · MTP5 · 纯文本 · HCCL AIV",
  "status": "104 单实例验证完成。",
  "result": "单实例通过",
  "notion": "https://app.notion.com/p/421498fd324f8184beefed01f75e3495?pvs=204",
  "resultNote": "P/D 分离两次在 Prefill 初始化阶段中断。表格为 4–7 卡单实例混部结果。",
  "decode": [
    {
      "label": "decode-8k-c1",
      "input_tokens": 8192,
      "concurrency": 1,
      "requests": 3,
      "batch_seconds": 27.54923228000189,
      "client_ttft_mean_ms": 343.1613,
      "client_stream_tpot_mean_ms": 69.56068530183727,
      "client_stream_tpot_uses_full_token_ids": true,
      "d_metrics": {
        "num_drafts": 84,
        "draft_tokens": 420,
        "accepted_tokens": 303,
        "acceptance_rate": 0.7214285714285714,
        "mean_accepted_length_including_target": 4.607142857142858,
        "itl_samples": 84,
        "itl_mean_ms": 315.6950363095131,
        "itl_p50_bucket_upper_ms": 400.0,
        "itl_p95_bucket_upper_ms": 400.0,
        "d_generation_tokens": 384,
        "remote_prefix_hits": 0,
        "local_prefix_hits": 23040
      }
    },
    {
      "label": "decode-128k-c1",
      "input_tokens": 131072,
      "concurrency": 1,
      "requests": 3,
      "batch_seconds": 26.943051189999096,
      "client_ttft_mean_ms": 602.7580333333333,
      "client_stream_tpot_mean_ms": 65.96234094488189,
      "client_stream_tpot_uses_full_token_ids": true,
      "d_metrics": {
        "num_drafts": 82,
        "draft_tokens": 410,
        "accepted_tokens": 303,
        "acceptance_rate": 0.7390243902439024,
        "mean_accepted_length_including_target": 4.695121951219512,
        "itl_samples": 82,
        "itl_mean_ms": 309.20827097565405,
        "itl_p50_bucket_upper_ms": 400.0,
        "itl_p95_bucket_upper_ms": 400.0,
        "d_generation_tokens": 384,
        "remote_prefix_hits": 0,
        "local_prefix_hits": 391680
      }
    },
    {
      "label": "decode-128k-c4",
      "input_tokens": 131072,
      "concurrency": 4,
      "requests": 8,
      "batch_seconds": 20.990118439996877,
      "client_ttft_mean_ms": 862.8884125,
      "client_stream_tpot_mean_ms": 67.44301023622047,
      "client_stream_tpot_uses_full_token_ids": true,
      "d_metrics": {
        "num_drafts": 218,
        "draft_tokens": 1090,
        "accepted_tokens": 804,
        "acceptance_rate": 0.7376146788990826,
        "mean_accepted_length_including_target": 4.688073394495413,
        "itl_samples": 218,
        "itl_mean_ms": 324.41477422019597,
        "itl_p50_bucket_upper_ms": 400.0,
        "itl_p95_bucket_upper_ms": 400.0,
        "d_generation_tokens": 1024,
        "remote_prefix_hits": 0,
        "local_prefix_hits": 1044480
      }
    }
  ],
  "profile": {
    "session": "decode-trace/Qwen4Exp_104_D_dp0_pp0_tp0_dcp0_ep0_rank0_198_20261123225951094_ascend_pt",
    "device_directories": [
      "device_4"
    ],
    "trace_path": "decode-trace/Qwen4Exp_104_D_dp0_pp0_tp0_dcp0_ep0_rank0_198_20261123225951094_ascend_pt/ASCEND_PROFILER_OUTPUT/trace_view.json",
    "kernel_csv": "decode-trace/Qwen4Exp_104_D_dp0_pp0_tp0_dcp0_ep0_rank0_198_20261123225951094_ascend_pt/ASCEND_PROFILER_OUTPUT/kernel_details.csv",
    "kernel_rows": 77994,
    "trace_events": 2074556,
    "top_kernels_by_sum": [
      {
        "type": "MatMulV3",
        "count": 10458,
        "sum_device_ms": 72.10012599999995
      },
      {
        "type": "hcom_allReduce_",
        "count": 4068,
        "sum_device_ms": 64.11382400000014
      },
      {
        "type": "hcom_allGather_",
        "count": 2484,
        "sum_device_ms": 30.18112799999999
      },
      {
        "type": "GroupedMatmulSwigluQuantV2",
        "count": 864,
        "sum_device_ms": 26.038480999999983
      },
      {
        "type": "GroupedMatmul",
        "count": 1044,
        "sum_device_ms": 21.737781000000012
      },
      {
        "type": "MoeDistributeDispatchV3",
        "count": 954,
        "sum_device_ms": 16.062629000000037
      },
      {
        "type": "Slice",
        "count": 5850,
        "sum_device_ms": 13.30887099999999
      },
      {
        "type": "Mul",
        "count": 4158,
        "sum_device_ms": 10.766578000000022
      },
      {
        "type": "MoeDistributeCombineV3",
        "count": 954,
        "sum_device_ms": 10.470216999999995
      },
      {
        "type": "GenericBlockSparseAttention",
        "count": 306,
        "sum_device_ms": 10.32193799999999
      },
      {
        "type": "LightningIndexerV2",
        "count": 306,
        "sum_device_ms": 7.573469000000004
      },
      {
        "type": "RecurrentGatedDeltaRule",
        "count": 648,
        "sum_device_ms": 7.208451999999994
      },
      {
        "type": "_hc_combine_norm_kernel",
        "count": 1890,
        "sum_device_ms": 6.931019999999988
      },
      {
        "type": "Index",
        "count": 1260,
        "sum_device_ms": 6.381124
      },
      {
        "type": "_hc_gate_mix_kernel",
        "count": 2016,
        "sum_device_ms": 6.024032
      },
      {
        "type": "Add",
        "count": 3474,
        "sum_device_ms": 5.972414999999992
      },
      {
        "type": "fused_gdn_gating_kernel",
        "count": 648,
        "sum_device_ms": 5.938767999999997
      },
      {
        "type": "CausalConv1d",
        "count": 648,
        "sum_device_ms": 5.426871999999995
      },
      {
        "type": "QuantBatchMatmulV3",
        "count": 864,
        "sum_device_ms": 5.3349749999999965
      },
      {
        "type": "RmsNorm",
        "count": 1404,
        "sum_device_ms": 4.997300999999994
      },
      {
        "type": "ClipByValueV2",
        "count": 2574,
        "sum_device_ms": 4.738852000000002
      },
      {
        "type": "Cast",
        "count": 3564,
        "sum_device_ms": 4.486803999999996
      },
      {
        "type": "ForeachAddList",
        "count": 954,
        "sum_device_ms": 4.475644000000003
      },
      {
        "type": "LightningIndexerV2Metadata",
        "count": 90,
        "sum_device_ms": 3.8929290000000014
      },
      {
        "type": "_hc_silu_kernel",
        "count": 2016,
        "sum_device_ms": 3.7857380000000056
      }
    ]
  },
  "windows": [
    {
      "id": "d-qsa",
      "label": "104 Decode · _store_qsa_rows_kernel",
      "span_us": 950,
      "selected": 22935,
      "events": [
        {
          "id": 22922,
          "name": "RmsNorm",
          "stream": "59",
          "duration_us": 2.76,
          "kind": "other",
          "start_us": 54.367
        },
        {
          "id": 22923,
          "name": "Slice",
          "stream": "59",
          "duration_us": 2.134,
          "kind": "other",
          "start_us": 80.338
        },
        {
          "id": 22924,
          "name": "ClipByValueV2",
          "stream": "59",
          "duration_us": 1.691,
          "kind": "other",
          "start_us": 85.123
        },
        {
          "id": 22925,
          "name": "Index",
          "stream": "59",
          "duration_us": 2.989,
          "kind": "other",
          "start_us": 96.498
        },
        {
          "id": 22926,
          "name": "Mul",
          "stream": "59",
          "duration_us": 3.687,
          "kind": "other",
          "start_us": 104.69
        },
        {
          "id": 22927,
          "name": "Mul",
          "stream": "59",
          "duration_us": 2.158,
          "kind": "other",
          "start_us": 112.96
        },
        {
          "id": 22928,
          "name": "Sub",
          "stream": "59",
          "duration_us": 1.459,
          "kind": "other",
          "start_us": 121.154
        },
        {
          "id": 22929,
          "name": "Mul",
          "stream": "59",
          "duration_us": 1.837,
          "kind": "other",
          "start_us": 128.561
        },
        {
          "id": 22930,
          "name": "Mul",
          "stream": "59",
          "duration_us": 1.958,
          "kind": "other",
          "start_us": 135.347
        },
        {
          "id": 22931,
          "name": "Add",
          "stream": "59",
          "duration_us": 1.357,
          "kind": "other",
          "start_us": 142.154
        },
        {
          "id": 22932,
          "name": "ConcatD",
          "stream": "59",
          "duration_us": 1.999,
          "kind": "other",
          "start_us": 149.946
        },
        {
          "id": 22933,
          "name": "ConcatD",
          "stream": "59",
          "duration_us": 2.078,
          "kind": "other",
          "start_us": 156.153
        },
        {
          "id": 22934,
          "name": "_store_qsa_rows_kernel",
          "stream": "59",
          "duration_us": 2.252,
          "kind": "qsa",
          "start_us": 162.442
        },
        {
          "id": 22935,
          "name": "_store_qsa_rows_kernel",
          "stream": "59",
          "duration_us": 2.528,
          "kind": "qsa",
          "start_us": 171.0
        },
        {
          "id": 22936,
          "name": "Fill",
          "stream": "59",
          "duration_us": 2.516,
          "kind": "other",
          "start_us": 181.146
        },
        {
          "id": 22937,
          "name": "FloorDiv",
          "stream": "59",
          "duration_us": 2.295,
          "kind": "other",
          "start_us": 188.954
        },
        {
          "id": 22938,
          "name": "FloorMod",
          "stream": "59",
          "duration_us": 2.266,
          "kind": "other",
          "start_us": 196.473
        },
        {
          "id": 22939,
          "name": "ClipByValueV2",
          "stream": "59",
          "duration_us": 2.696,
          "kind": "other",
          "start_us": 203.832
        },
        {
          "id": 22940,
          "name": "Fill",
          "stream": "59",
          "duration_us": 2.022,
          "kind": "other",
          "start_us": 211.528
        },
        {
          "id": 22941,
          "name": "LightningIndexerV2",
          "stream": "59",
          "duration_us": 27.685,
          "kind": "qsa",
          "start_us": 480.542
        },
        {
          "id": 22942,
          "name": "_pack_qsa_group_indices_kernel",
          "stream": "59",
          "duration_us": 3.545,
          "kind": "qsa",
          "start_us": 508.249
        },
        {
          "id": 22943,
          "name": "_store_qsa_rows_kernel",
          "stream": "59",
          "duration_us": 2.762,
          "kind": "qsa",
          "start_us": 514.526
        },
        {
          "id": 22944,
          "name": "_store_qsa_rows_kernel",
          "stream": "59",
          "duration_us": 1.426,
          "kind": "qsa",
          "start_us": 522.67
        },
        {
          "id": 22945,
          "name": "ZerosLike",
          "stream": "59",
          "duration_us": 2.542,
          "kind": "other",
          "start_us": 790.452
        },
        {
          "id": 22946,
          "name": "_prepare_qsa_gbsa_rows_kernel",
          "stream": "59",
          "duration_us": 5.685,
          "kind": "qsa",
          "start_us": 804.101
        },
        {
          "id": 22947,
          "name": "GenericBlockSparseAttention",
          "stream": "59",
          "duration_us": 33.503,
          "kind": "qsa",
          "start_us": 821.84
        }
      ]
    },
    {
      "id": "d-gdn",
      "label": "104 Decode · CausalConv1d",
      "span_us": 640,
      "selected": 35626,
      "events": [
        {
          "id": 35625,
          "name": "Slice",
          "stream": "59",
          "duration_us": 3.718,
          "kind": "other",
          "start_us": 83.598
        },
        {
          "id": 35626,
          "name": "CausalConv1d",
          "stream": "59",
          "duration_us": 7.945,
          "kind": "gdn",
          "start_us": 115.2
        },
        {
          "id": 35627,
          "name": "Slice",
          "stream": "59",
          "duration_us": 2.651,
          "kind": "other",
          "start_us": 141.84
        },
        {
          "id": 35628,
          "name": "Slice",
          "stream": "59",
          "duration_us": 1.855,
          "kind": "other",
          "start_us": 153.576
        },
        {
          "id": 35629,
          "name": "Slice",
          "stream": "59",
          "duration_us": 2.04,
          "kind": "other",
          "start_us": 160.376
        },
        {
          "id": 35630,
          "name": "fused_gdn_gating_kernel",
          "stream": "59",
          "duration_us": 6.954,
          "kind": "gdn",
          "start_us": 167.64
        },
        {
          "id": 35631,
          "name": "l2norm_fwd_kernel2",
          "stream": "59",
          "duration_us": 2.872,
          "kind": "other",
          "start_us": 175.948
        },
        {
          "id": 35632,
          "name": "l2norm_fwd_kernel2",
          "stream": "59",
          "duration_us": 1.802,
          "kind": "other",
          "start_us": 183.402
        },
        {
          "id": 35633,
          "name": "RecurrentGatedDeltaRule",
          "stream": "59",
          "duration_us": 10.766,
          "kind": "gdn",
          "start_us": 474.961
        },
        {
          "id": 35634,
          "name": "Slice",
          "stream": "59",
          "duration_us": 2.175,
          "kind": "other",
          "start_us": 539.872
        },
        {
          "id": 35635,
          "name": "_layer_norm_fwd_1pass_kernel_npu",
          "stream": "59",
          "duration_us": 3.963,
          "kind": "other",
          "start_us": 548.539
        }
      ]
    },
    {
      "id": "p-qsa",
      "label": "114 Prefill A · _store_qsa_rows_kernel",
      "span_us": 950,
      "selected": 21313,
      "events": [
        {
          "id": 21308,
          "name": "LightningIndexerV2",
          "stream": "59",
          "duration_us": 4522.765,
          "kind": "qsa",
          "start_us": -4442.064
        },
        {
          "id": 21312,
          "name": "_pack_qsa_group_indices_kernel",
          "stream": "59",
          "duration_us": 90.255,
          "kind": "qsa",
          "start_us": 80.723
        },
        {
          "id": 21313,
          "name": "_store_qsa_rows_kernel",
          "stream": "59",
          "duration_us": 51.193,
          "kind": "qsa",
          "start_us": 171.0
        },
        {
          "id": 21314,
          "name": "_store_qsa_rows_kernel",
          "stream": "59",
          "duration_us": 38.216,
          "kind": "qsa",
          "start_us": 222.215
        },
        {
          "id": 21315,
          "name": "ZerosLike",
          "stream": "59",
          "duration_us": 9.743,
          "kind": "other",
          "start_us": 260.453
        },
        {
          "id": 21316,
          "name": "_prepare_qsa_gbsa_rows_kernel",
          "stream": "59",
          "duration_us": 192.868,
          "kind": "qsa",
          "start_us": 270.218
        },
        {
          "id": 21317,
          "name": "GenericBlockSparseAttentionMetadata",
          "stream": "59",
          "duration_us": 646.302,
          "kind": "qsa",
          "start_us": 463.108
        },
        {
          "id": 21318,
          "name": "HcclLaunchAicpuKernel",
          "stream": "23",
          "duration_us": 167.105,
          "kind": "other",
          "start_us": 736.686
        }
      ]
    },
    {
      "id": "p-gdn",
      "label": "114 Prefill A · CausalConv1d",
      "span_us": 640,
      "selected": 28038,
      "events": [
        {
          "id": 28030,
          "name": "MatMulV3",
          "stream": "59",
          "duration_us": 406.056,
          "kind": "moe",
          "start_us": -350.957
        },
        {
          "id": 28031,
          "name": "HcclLaunchAicpuKernel",
          "stream": "23",
          "duration_us": 95.418,
          "kind": "other",
          "start_us": -73.797
        },
        {
          "id": 28032,
          "name": "MatMulV3",
          "stream": "59",
          "duration_us": 15.836,
          "kind": "moe",
          "start_us": 55.121
        },
        {
          "id": 28033,
          "name": "Slice",
          "stream": "59",
          "duration_us": 3.481,
          "kind": "other",
          "start_us": 70.979
        },
        {
          "id": 28034,
          "name": "Slice",
          "stream": "59",
          "duration_us": 3.236,
          "kind": "other",
          "start_us": 74.482
        },
        {
          "id": 28035,
          "name": "ZerosLike",
          "stream": "59",
          "duration_us": 10.18,
          "kind": "other",
          "start_us": 77.74
        },
        {
          "id": 28036,
          "name": "Slice",
          "stream": "59",
          "duration_us": 2.11,
          "kind": "other",
          "start_us": 87.942
        },
        {
          "id": 28037,
          "name": "Slice",
          "stream": "59",
          "duration_us": 25.104,
          "kind": "other",
          "start_us": 90.074
        },
        {
          "id": 28038,
          "name": "CausalConv1d",
          "stream": "59",
          "duration_us": 77.38,
          "kind": "gdn",
          "start_us": 115.2
        },
        {
          "id": 28039,
          "name": "fused_gdn_gating_kernel",
          "stream": "59",
          "duration_us": 50.954,
          "kind": "gdn",
          "start_us": 192.602
        },
        {
          "id": 28040,
          "name": "_gather_ssm_states_kernel",
          "stream": "59",
          "duration_us": 5.958,
          "kind": "other",
          "start_us": 243.578
        },
        {
          "id": 28041,
          "name": "Cast",
          "stream": "59",
          "duration_us": 3.847,
          "kind": "other",
          "start_us": 249.558
        },
        {
          "id": 28042,
          "name": "Transpose",
          "stream": "59",
          "duration_us": 5.639,
          "kind": "other",
          "start_us": 253.427
        },
        {
          "id": 28043,
          "name": "Transpose",
          "stream": "59",
          "duration_us": 4.223,
          "kind": "other",
          "start_us": 259.088
        },
        {
          "id": 28044,
          "name": "ChunkGatedDeltaRuleFwdPrepare",
          "stream": "59",
          "duration_us": 203.632,
          "kind": "gdn",
          "start_us": 263.333
        },
        {
          "id": 28045,
          "name": "ChunkFwdH",
          "stream": "59",
          "duration_us": 389.502,
          "kind": "gdn",
          "start_us": 466.987
        }
      ]
    }
  ]
};
