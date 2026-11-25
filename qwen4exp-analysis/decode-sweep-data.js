"use strict";

window.qwenDecodeSweep = {
  "perf": [
    {
      "batch": 1,
      "input_tokens_per_request": 131072,
      "output_tokens_per_request": 96,
      "ttft_mean_ms": 614.9623,
      "tpot_mean_ms": 72.92315,
      "decoded_tokens_per_s": 13.71307,
      "itl_mean_ms": 333.74003,
      "itl_samples": 21,
      "drafted": 105,
      "accepted": 79,
      "acceptance_rate": 0.75238
    },
    {
      "batch": 2,
      "input_tokens_per_request": 131072,
      "output_tokens_per_request": 96,
      "ttft_mean_ms": 4968.64045,
      "tpot_mean_ms": 116.06394,
      "decoded_tokens_per_s": 12.05892,
      "itl_mean_ms": 541.7253,
      "itl_samples": 41,
      "drafted": 205,
      "accepted": 156,
      "acceptance_rate": 0.76098
    },
    {
      "batch": 4,
      "input_tokens_per_request": 131072,
      "output_tokens_per_request": 96,
      "ttft_mean_ms": 1030.65262,
      "tpot_mean_ms": 71.9673,
      "decoded_tokens_per_s": 50.01706,
      "itl_mean_ms": 334.0289,
      "itl_samples": 84,
      "drafted": 420,
      "accepted": 313,
      "acceptance_rate": 0.74524
    },
    {
      "batch": 8,
      "input_tokens_per_request": 131072,
      "output_tokens_per_request": 96,
      "ttft_mean_ms": 1715.83426,
      "tpot_mean_ms": 61.94315,
      "decoded_tokens_per_s": 104.79932,
      "itl_mean_ms": 316.23183,
      "itl_samples": 164,
      "drafted": 820,
      "accepted": 629,
      "acceptance_rate": 0.76707
    },
    {
      "batch": 16,
      "input_tokens_per_request": 131072,
      "output_tokens_per_request": 96,
      "ttft_mean_ms": 2542.98941,
      "tpot_mean_ms": 56.338,
      "decoded_tokens_per_s": 209.19812,
      "itl_mean_ms": 301.65264,
      "itl_samples": 335,
      "drafted": 1675,
      "accepted": 1248,
      "acceptance_rate": 0.74507
    },
    {
      "batch": 32,
      "input_tokens_per_request": 131072,
      "output_tokens_per_request": 96,
      "ttft_mean_ms": 6404.82582,
      "tpot_mean_ms": 57.10704,
      "decoded_tokens_per_s": 212.79816,
      "itl_mean_ms": 304.44242,
      "itl_samples": 667,
      "drafted": 3335,
      "accepted": 2500,
      "acceptance_rate": 0.74963
    }
  ],
  "kernels": [
    {
      "name": "hcom_allReduce_",
      "points": [
        {
          "batch": 1,
          "calls": 1808,
          "total_us": 28545.1,
          "mean_us": 15.78822,
          "p50_us": 15.838,
          "p95_us": 16.896,
          "core": "COMMUNICATION",
          "pipeline": {
            "coverage": 50.0,
            "measured_calls": 904,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 9.55,
              "MTE3": 20.31,
              "Vector": 0.0,
              "Cube": 0.0,
              "Scalar": 16.13,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 2,
          "calls": 1808,
          "total_us": 42876.562,
          "mean_us": 23.71491,
          "p50_us": 24.4025,
          "p95_us": 26.843,
          "core": "COMMUNICATION",
          "pipeline": {
            "coverage": 50.0,
            "measured_calls": 904,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 33.82,
              "MTE3": 5.21,
              "Vector": 0.0,
              "Cube": 0.0,
              "Scalar": 20.29,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 4,
          "calls": 1808,
          "total_us": 45313.676,
          "mean_us": 25.06287,
          "p50_us": 25.9475,
          "p95_us": 28.405,
          "core": "COMMUNICATION",
          "pipeline": {
            "coverage": 50.0,
            "measured_calls": 904,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 33.8,
              "MTE3": 5.26,
              "Vector": 0.0,
              "Cube": 0.0,
              "Scalar": 19.36,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 8,
          "calls": 1808,
          "total_us": 46835.334,
          "mean_us": 25.9045,
          "p50_us": 26.654,
          "p95_us": 28.889,
          "core": "COMMUNICATION",
          "pipeline": {
            "coverage": 50.0,
            "measured_calls": 904,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 34.66,
              "MTE3": 5.45,
              "Vector": 0.0,
              "Cube": 0.0,
              "Scalar": 18.79,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 16,
          "calls": 1582,
          "total_us": 51726.796,
          "mean_us": 32.69709,
          "p50_us": 28.922,
          "p95_us": 61.216,
          "core": "COMMUNICATION",
          "pipeline": {
            "coverage": 50.0,
            "measured_calls": 791,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 42.05,
              "MTE3": 4.08,
              "Vector": 0.0,
              "Cube": 0.0,
              "Scalar": 16.39,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 17,
          "calls": 1582,
          "total_us": 61384.998,
          "mean_us": 38.80215,
          "p50_us": 29.326,
          "p95_us": 104.17,
          "core": "COMMUNICATION",
          "pipeline": {
            "coverage": 50.0,
            "measured_calls": 791,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 45.93,
              "MTE3": 4.03,
              "Vector": 0.0,
              "Cube": 0.0,
              "Scalar": 15.03,
              "Fixpipe": 0.0
            }
          }
        }
      ]
    },
    {
      "name": "MatMulV3",
      "points": [
        {
          "batch": 1,
          "calls": 4648,
          "total_us": 32028.838,
          "mean_us": 6.89089,
          "p50_us": 5.89,
          "p95_us": 11.164,
          "core": "AI_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 4648,
            "scores": {
              "MTE1": 17.2,
              "MTE2": 57.7,
              "MTE3": 0.12,
              "Vector": 0.19,
              "Cube": 13.8,
              "Scalar": 37.42,
              "Fixpipe": 30.11
            }
          }
        },
        {
          "batch": 2,
          "calls": 4648,
          "total_us": 33113.031,
          "mean_us": 7.12415,
          "p50_us": 5.9915,
          "p95_us": 11.368,
          "core": "AI_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 4648,
            "scores": {
              "MTE1": 16.72,
              "MTE2": 58.93,
              "MTE3": 0.22,
              "Vector": 0.43,
              "Cube": 13.29,
              "Scalar": 35.95,
              "Fixpipe": 31.64
            }
          }
        },
        {
          "batch": 4,
          "calls": 4648,
          "total_us": 34887.266,
          "mean_us": 7.50587,
          "p50_us": 6.2075,
          "p95_us": 12.113,
          "core": "AI_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 4648,
            "scores": {
              "MTE1": 16.99,
              "MTE2": 59.77,
              "MTE3": 0.4,
              "Vector": 1.13,
              "Cube": 15.75,
              "Scalar": 34.74,
              "Fixpipe": 33.19
            }
          }
        },
        {
          "batch": 8,
          "calls": 4648,
          "total_us": 37815.683,
          "mean_us": 8.1359,
          "p50_us": 6.752,
          "p95_us": 13.682,
          "core": "AI_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 4648,
            "scores": {
              "MTE1": 16.78,
              "MTE2": 61.6,
              "MTE3": 0.41,
              "Vector": 1.02,
              "Cube": 17.44,
              "Scalar": 32.49,
              "Fixpipe": 33.27
            }
          }
        },
        {
          "batch": 16,
          "calls": 4067,
          "total_us": 41310.163,
          "mean_us": 10.1574,
          "p50_us": 8.354,
          "p95_us": 20.78,
          "core": "AI_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 4067,
            "scores": {
              "MTE1": 18.2,
              "MTE2": 63.25,
              "MTE3": 0.47,
              "Vector": 1.14,
              "Cube": 29.33,
              "Scalar": 26.92,
              "Fixpipe": 40.87
            }
          }
        },
        {
          "batch": 17,
          "calls": 4067,
          "total_us": 45661.449,
          "mean_us": 11.2273,
          "p50_us": 7.71,
          "p95_us": 28.239,
          "core": "AI_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 4067,
            "scores": {
              "MTE1": 18.97,
              "MTE2": 65.37,
              "MTE3": 0.41,
              "Vector": 0.77,
              "Cube": 37.2,
              "Scalar": 25.81,
              "Fixpipe": 39.21
            }
          }
        }
      ]
    },
    {
      "name": "GenericBlockSparseAttention",
      "points": [
        {
          "batch": 1,
          "calls": 136,
          "total_us": 4532.463,
          "mean_us": 33.32693,
          "p50_us": 34.0455,
          "p95_us": 35.907,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 136,
            "scores": {
              "MTE1": 3.73,
              "MTE2": 27.78,
              "MTE3": 1.91,
              "Vector": 2.54,
              "Cube": 3.44,
              "Scalar": 41.34,
              "Fixpipe": 0.72
            }
          }
        },
        {
          "batch": 2,
          "calls": 136,
          "total_us": 7137.795,
          "mean_us": 52.48379,
          "p50_us": 58.3075,
          "p95_us": 64.46,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 136,
            "scores": {
              "MTE1": 9.06,
              "MTE2": 60.29,
              "MTE3": 1.31,
              "Vector": 0.87,
              "Cube": 7.96,
              "Scalar": 39.68,
              "Fixpipe": 1.33
            }
          }
        },
        {
          "batch": 4,
          "calls": 136,
          "total_us": 7280.333,
          "mean_us": 53.53186,
          "p50_us": 59.465,
          "p95_us": 65.234,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 136,
            "scores": {
              "MTE1": 10.41,
              "MTE2": 69.36,
              "MTE3": 2.63,
              "Vector": 1.49,
              "Cube": 9.17,
              "Scalar": 38.51,
              "Fixpipe": 1.5
            }
          }
        },
        {
          "batch": 8,
          "calls": 136,
          "total_us": 10810.69,
          "mean_us": 79.49037,
          "p50_us": 89.457,
          "p95_us": 105.374,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 136,
            "scores": {
              "MTE1": 13.5,
              "MTE2": 75.31,
              "MTE3": 2.84,
              "Vector": 1.82,
              "Cube": 11.47,
              "Scalar": 41.98,
              "Fixpipe": 1.85
            }
          }
        },
        {
          "batch": 16,
          "calls": 119,
          "total_us": 23246.103,
          "mean_us": 195.3454,
          "p50_us": 136.971,
          "p95_us": 803.808,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 119,
            "scores": {
              "MTE1": 17.02,
              "MTE2": 81.22,
              "MTE3": 2.62,
              "Vector": 2.02,
              "Cube": 14.06,
              "Scalar": 56.16,
              "Fixpipe": 2.26
            }
          }
        },
        {
          "batch": 17,
          "calls": 119,
          "total_us": 34927.584,
          "mean_us": 293.50911,
          "p50_us": 151.83,
          "p95_us": 1616.175,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 119,
            "scores": {
              "MTE1": 16.44,
              "MTE2": 74.02,
              "MTE3": 2.38,
              "Vector": 1.93,
              "Cube": 13.44,
              "Scalar": 66.49,
              "Fixpipe": 2.16
            }
          }
        }
      ]
    },
    {
      "name": "GroupedMatmulSwigluQuantV2",
      "points": [
        {
          "batch": 1,
          "calls": 384,
          "total_us": 11112.466,
          "mean_us": 28.93871,
          "p50_us": 27.3055,
          "p95_us": 39.77,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 384,
            "scores": {
              "MTE1": 13.78,
              "MTE2": 37.84,
              "MTE3": 0.97,
              "Vector": 0.39,
              "Cube": 12.98,
              "Scalar": 74.98,
              "Fixpipe": 0.35
            }
          }
        },
        {
          "batch": 2,
          "calls": 384,
          "total_us": 15145.174,
          "mean_us": 39.44056,
          "p50_us": 40.8125,
          "p95_us": 46.09,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 384,
            "scores": {
              "MTE1": 16.34,
              "MTE2": 49.01,
              "MTE3": 1.99,
              "Vector": 0.55,
              "Cube": 15.89,
              "Scalar": 71.64,
              "Fixpipe": 0.43
            }
          }
        },
        {
          "batch": 4,
          "calls": 384,
          "total_us": 18110.284,
          "mean_us": 47.1622,
          "p50_us": 44.5145,
          "p95_us": 59.834,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 384,
            "scores": {
              "MTE1": 17.58,
              "MTE2": 55.4,
              "MTE3": 3.13,
              "Vector": 0.82,
              "Cube": 17.12,
              "Scalar": 67.98,
              "Fixpipe": 0.47
            }
          }
        },
        {
          "batch": 8,
          "calls": 384,
          "total_us": 17488.806,
          "mean_us": 45.54377,
          "p50_us": 44.3755,
          "p95_us": 60.866,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 384,
            "scores": {
              "MTE1": 15.97,
              "MTE2": 54.33,
              "MTE3": 2.66,
              "Vector": 1.35,
              "Cube": 15.79,
              "Scalar": 65.29,
              "Fixpipe": 0.48
            }
          }
        },
        {
          "batch": 16,
          "calls": 336,
          "total_us": 24094.907,
          "mean_us": 71.71103,
          "p50_us": 60.2155,
          "p95_us": 162.514,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 336,
            "scores": {
              "MTE1": 18.15,
              "MTE2": 66.58,
              "MTE3": 1.61,
              "Vector": 2.51,
              "Cube": 18.68,
              "Scalar": 58.66,
              "Fixpipe": 0.63
            }
          }
        },
        {
          "batch": 17,
          "calls": 336,
          "total_us": 25702.806,
          "mean_us": 76.49645,
          "p50_us": 65.942,
          "p95_us": 167.402,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 336,
            "scores": {
              "MTE1": 18.82,
              "MTE2": 68.38,
              "MTE3": 1.66,
              "Vector": 3.27,
              "Cube": 20.07,
              "Scalar": 58.29,
              "Fixpipe": 0.72
            }
          }
        }
      ]
    },
    {
      "name": "LightningIndexerV2",
      "points": [
        {
          "batch": 1,
          "calls": 136,
          "total_us": 3368.197,
          "mean_us": 24.76615,
          "p50_us": 26.7675,
          "p95_us": 28.199,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 136,
            "scores": {
              "MTE1": 10.54,
              "MTE2": 44.69,
              "MTE3": 8.71,
              "Vector": 10.92,
              "Cube": 8.32,
              "Scalar": 40.6,
              "Fixpipe": 4.02
            }
          }
        },
        {
          "batch": 2,
          "calls": 136,
          "total_us": 4711.315,
          "mean_us": 34.64202,
          "p50_us": 39.2575,
          "p95_us": 40.385,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 136,
            "scores": {
              "MTE1": 13.52,
              "MTE2": 51.64,
              "MTE3": 11.35,
              "Vector": 11.94,
              "Cube": 10.91,
              "Scalar": 38.46,
              "Fixpipe": 5.28
            }
          }
        },
        {
          "batch": 4,
          "calls": 136,
          "total_us": 6710.156,
          "mean_us": 49.33938,
          "p50_us": 56.6655,
          "p95_us": 58.191,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 136,
            "scores": {
              "MTE1": 18.6,
              "MTE2": 66.29,
              "MTE3": 15.37,
              "Vector": 14.69,
              "Cube": 14.81,
              "Scalar": 43.36,
              "Fixpipe": 7.18
            }
          }
        },
        {
          "batch": 8,
          "calls": 136,
          "total_us": 10834.287,
          "mean_us": 79.66388,
          "p50_us": 91.5985,
          "p95_us": 93.966,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 136,
            "scores": {
              "MTE1": 21.25,
              "MTE2": 90.81,
              "MTE3": 20.83,
              "Vector": 18.55,
              "Cube": 16.56,
              "Scalar": 45.17,
              "Fixpipe": 8.01
            }
          }
        },
        {
          "batch": 16,
          "calls": 119,
          "total_us": 21225.68,
          "mean_us": 178.36706,
          "p50_us": 177.639,
          "p95_us": 381.314,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 119,
            "scores": {
              "MTE1": 28.76,
              "MTE2": 90.37,
              "MTE3": 24.23,
              "Vector": 26.57,
              "Cube": 19.94,
              "Scalar": 47.08,
              "Fixpipe": 10.03
            }
          }
        },
        {
          "batch": 17,
          "calls": 119,
          "total_us": 18835.084,
          "mean_us": 158.27802,
          "p50_us": 105.635,
          "p95_us": 673.287,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 119,
            "scores": {
              "MTE1": 51.52,
              "MTE2": 75.58,
              "MTE3": 32.37,
              "Vector": 43.15,
              "Cube": 31.39,
              "Scalar": 68.5,
              "Fixpipe": 16.05
            }
          }
        }
      ]
    },
    {
      "name": "GroupedMatmul",
      "points": [
        {
          "batch": 1,
          "calls": 464,
          "total_us": 9468.531,
          "mean_us": 20.40632,
          "p50_us": 20.4555,
          "p95_us": 23.524,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 464,
            "scores": {
              "MTE1": 8.08,
              "MTE2": 24.23,
              "MTE3": 1.42,
              "Vector": 0.46,
              "Cube": 6.83,
              "Scalar": 90.46,
              "Fixpipe": 15.22
            }
          }
        },
        {
          "batch": 2,
          "calls": 464,
          "total_us": 12275.191,
          "mean_us": 26.45515,
          "p50_us": 26.547,
          "p95_us": 32.418,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 464,
            "scores": {
              "MTE1": 10.26,
              "MTE2": 32.71,
              "MTE3": 2.12,
              "Vector": 0.71,
              "Cube": 8.92,
              "Scalar": 82.29,
              "Fixpipe": 9.4
            }
          }
        },
        {
          "batch": 4,
          "calls": 464,
          "total_us": 14281.007,
          "mean_us": 30.77803,
          "p50_us": 30.546,
          "p95_us": 39.373,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 464,
            "scores": {
              "MTE1": 12.29,
              "MTE2": 39.41,
              "MTE3": 2.51,
              "Vector": 1.13,
              "Cube": 10.42,
              "Scalar": 79.46,
              "Fixpipe": 11.43
            }
          }
        },
        {
          "batch": 8,
          "calls": 464,
          "total_us": 13527.391,
          "mean_us": 29.15386,
          "p50_us": 28.7075,
          "p95_us": 37.292,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 464,
            "scores": {
              "MTE1": 11.26,
              "MTE2": 37.06,
              "MTE3": 3.7,
              "Vector": 1.9,
              "Cube": 9.73,
              "Scalar": 79.6,
              "Fixpipe": 10.8
            }
          }
        },
        {
          "batch": 16,
          "calls": 406,
          "total_us": 16919.522,
          "mean_us": 41.6737,
          "p50_us": 35.2035,
          "p95_us": 96.554,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 406,
            "scores": {
              "MTE1": 14.6,
              "MTE2": 48.6,
              "MTE3": 6.5,
              "Vector": 3.56,
              "Cube": 13.48,
              "Scalar": 75.83,
              "Fixpipe": 15.08
            }
          }
        },
        {
          "batch": 17,
          "calls": 406,
          "total_us": 18039.18,
          "mean_us": 44.43148,
          "p50_us": 37.619,
          "p95_us": 101.802,
          "core": "MIX_AIC",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 406,
            "scores": {
              "MTE1": 15.16,
              "MTE2": 50.46,
              "MTE3": 6.6,
              "Vector": 4.26,
              "Cube": 14.78,
              "Scalar": 74.87,
              "Fixpipe": 16.42
            }
          }
        }
      ]
    },
    {
      "name": "_hc_combine_norm_kernel",
      "points": [
        {
          "batch": 1,
          "calls": 840,
          "total_us": 3067.484,
          "mean_us": 3.65177,
          "p50_us": 3.647,
          "p95_us": 4.171,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 840,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 18.65,
              "MTE3": 14.43,
              "Vector": 37.92,
              "Cube": 0.0,
              "Scalar": 28.11,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 2,
          "calls": 840,
          "total_us": 3783.306,
          "mean_us": 4.50394,
          "p50_us": 4.472,
          "p95_us": 5.32,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 840,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 13.63,
              "MTE3": 12.15,
              "Vector": 39.57,
              "Cube": 0.0,
              "Scalar": 27.75,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 4,
          "calls": 840,
          "total_us": 5177.512,
          "mean_us": 6.1637,
          "p50_us": 6.2045,
          "p95_us": 7.416,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 840,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 15.92,
              "MTE3": 14.17,
              "Vector": 42.64,
              "Cube": 0.0,
              "Scalar": 27.45,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 8,
          "calls": 840,
          "total_us": 6512.487,
          "mean_us": 7.75296,
          "p50_us": 8.0575,
          "p95_us": 9.024,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 840,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 21.85,
              "MTE3": 19.9,
              "Vector": 48.05,
              "Cube": 0.0,
              "Scalar": 27.55,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 16,
          "calls": 735,
          "total_us": 12788.779,
          "mean_us": 17.3997,
          "p50_us": 12.374,
          "p95_us": 55.188,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 735,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 35.37,
              "MTE3": 27.28,
              "Vector": 52.77,
              "Cube": 0.0,
              "Scalar": 29.65,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 17,
          "calls": 735,
          "total_us": 17766.861,
          "mean_us": 24.1726,
          "p50_us": 13.7,
          "p95_us": 98.116,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 735,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 38.13,
              "MTE3": 27.94,
              "Vector": 53.3,
              "Cube": 0.0,
              "Scalar": 30.6,
              "Fixpipe": 0.0
            }
          }
        }
      ]
    },
    {
      "name": "hcom_allGather_",
      "points": [
        {
          "batch": 1,
          "calls": 1104,
          "total_us": 13359.016,
          "mean_us": 12.10056,
          "p50_us": 11.5195,
          "p95_us": 15.842,
          "core": "COMMUNICATION",
          "pipeline": {
            "coverage": 50.0,
            "measured_calls": 552,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 5.11,
              "MTE3": 1.77,
              "Vector": 0.0,
              "Cube": 0.0,
              "Scalar": 27.79,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 2,
          "calls": 1088,
          "total_us": 14036.644,
          "mean_us": 12.90133,
          "p50_us": 12.475,
          "p95_us": 21.009,
          "core": "COMMUNICATION",
          "pipeline": {
            "coverage": 50.0,
            "measured_calls": 544,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 3.57,
              "MTE3": 1.67,
              "Vector": 0.0,
              "Cube": 0.0,
              "Scalar": 26.86,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 4,
          "calls": 1088,
          "total_us": 15656.052,
          "mean_us": 14.38975,
          "p50_us": 13.1345,
          "p95_us": 33.313,
          "core": "COMMUNICATION",
          "pipeline": {
            "coverage": 50.0,
            "measured_calls": 544,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 4.55,
              "MTE3": 1.91,
              "Vector": 0.0,
              "Cube": 0.0,
              "Scalar": 26.02,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 8,
          "calls": 1008,
          "total_us": 14313.702,
          "mean_us": 14.2001,
          "p50_us": 14.558,
          "p95_us": 15.728,
          "core": "COMMUNICATION",
          "pipeline": {
            "coverage": 50.0,
            "measured_calls": 504,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 3.44,
              "MTE3": 1.55,
              "Vector": 0.0,
              "Cube": 0.0,
              "Scalar": 26.61,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 16,
          "calls": 782,
          "total_us": 13253.85,
          "mean_us": 16.94866,
          "p50_us": 17.671,
          "p95_us": 18.79,
          "core": "COMMUNICATION",
          "pipeline": {
            "coverage": 50.0,
            "measured_calls": 391,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 5.1,
              "MTE3": 1.95,
              "Vector": 0.0,
              "Cube": 0.0,
              "Scalar": 26.25,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 17,
          "calls": 780,
          "total_us": 13465.02,
          "mean_us": 17.26285,
          "p50_us": 18.029,
          "p95_us": 19.032,
          "core": "COMMUNICATION",
          "pipeline": {
            "coverage": 50.0,
            "measured_calls": 390,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 4.92,
              "MTE3": 1.97,
              "Vector": 0.0,
              "Cube": 0.0,
              "Scalar": 25.94,
              "Fixpipe": 0.0
            }
          }
        }
      ]
    },
    {
      "name": "RecurrentGatedDeltaRule",
      "points": [
        {
          "batch": 1,
          "calls": 288,
          "total_us": 3207.983,
          "mean_us": 11.13883,
          "p50_us": 11.0995,
          "p95_us": 11.597,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 288,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 18.83,
              "MTE3": 47.72,
              "Vector": 66.18,
              "Cube": 0.0,
              "Scalar": 43.62,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 2,
          "calls": 288,
          "total_us": 3385.197,
          "mean_us": 11.75416,
          "p50_us": 11.757,
          "p95_us": 12.282,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 288,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 18.29,
              "MTE3": 45.77,
              "Vector": 64.3,
              "Cube": 0.0,
              "Scalar": 45.66,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 4,
          "calls": 288,
          "total_us": 3742.941,
          "mean_us": 12.99632,
          "p50_us": 12.9935,
          "p95_us": 13.736,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 288,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 18.07,
              "MTE3": 42.96,
              "Vector": 60.58,
              "Cube": 0.0,
              "Scalar": 48.28,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 8,
          "calls": 288,
          "total_us": 6072.606,
          "mean_us": 21.08544,
          "p50_us": 20.978,
          "p95_us": 22.21,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 288,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 18.67,
              "MTE3": 48.32,
              "Vector": 66.38,
              "Cube": 0.0,
              "Scalar": 50.25,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 16,
          "calls": 252,
          "total_us": 7625.757,
          "mean_us": 30.26094,
          "p50_us": 30.219,
          "p95_us": 31.367,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 252,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 19.73,
              "MTE3": 56.31,
              "Vector": 74.39,
              "Cube": 0.0,
              "Scalar": 50.76,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 17,
          "calls": 252,
          "total_us": 9066.442,
          "mean_us": 35.97794,
          "p50_us": 36.842,
          "p95_us": 38.059,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 252,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 19.37,
              "MTE3": 55.65,
              "Vector": 75.5,
              "Cube": 0.0,
              "Scalar": 50.81,
              "Fixpipe": 0.0
            }
          }
        }
      ]
    },
    {
      "name": "Slice",
      "points": [
        {
          "batch": 1,
          "calls": 2600,
          "total_us": 5912.7,
          "mean_us": 2.27412,
          "p50_us": 2.0825,
          "p95_us": 3.694,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 2600,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 28.23,
              "MTE3": 10.35,
              "Vector": 0.0,
              "Cube": 0.0,
              "Scalar": 34.41,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 2,
          "calls": 2984,
          "total_us": 7287.94,
          "mean_us": 2.44234,
          "p50_us": 2.174,
          "p95_us": 4.546,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 2984,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 27.21,
              "MTE3": 8.95,
              "Vector": 0.0,
              "Cube": 0.0,
              "Scalar": 34.79,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 4,
          "calls": 2984,
          "total_us": 7710.153,
          "mean_us": 2.58383,
          "p50_us": 2.324,
          "p95_us": 4.354,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 2984,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 26.94,
              "MTE3": 8.87,
              "Vector": 0.0,
              "Cube": 0.0,
              "Scalar": 35.37,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 8,
          "calls": 2984,
          "total_us": 8295.164,
          "mean_us": 2.77988,
          "p50_us": 2.718,
          "p95_us": 4.095,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 2984,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 26.97,
              "MTE3": 8.67,
              "Vector": 0.0,
              "Cube": 0.0,
              "Scalar": 38.8,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 16,
          "calls": 2652,
          "total_us": 7885.254,
          "mean_us": 2.97332,
          "p50_us": 2.916,
          "p95_us": 4.422,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 2652,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 27.95,
              "MTE3": 9.85,
              "Vector": 0.0,
              "Cube": 0.0,
              "Scalar": 36.86,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 17,
          "calls": 2652,
          "total_us": 8215.814,
          "mean_us": 3.09797,
          "p50_us": 2.98,
          "p95_us": 4.875,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 2652,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 28.43,
              "MTE3": 10.11,
              "Vector": 0.0,
              "Cube": 0.0,
              "Scalar": 36.36,
              "Fixpipe": 0.0
            }
          }
        }
      ]
    },
    {
      "name": "MoeDistributeDispatchV3",
      "points": [
        {
          "batch": 1,
          "calls": 424,
          "total_us": 7139.956,
          "mean_us": 16.83952,
          "p50_us": 16.825,
          "p95_us": 18.762,
          "core": "MIX_AIV",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 424,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 12.49,
              "MTE3": 12.23,
              "Vector": 9.08,
              "Cube": 0.0,
              "Scalar": 31.03,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 2,
          "calls": 424,
          "total_us": 7691.514,
          "mean_us": 18.14036,
          "p50_us": 18.3115,
          "p95_us": 19.954,
          "core": "MIX_AIV",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 424,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 12.59,
              "MTE3": 12.91,
              "Vector": 9.36,
              "Cube": 0.0,
              "Scalar": 30.11,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 4,
          "calls": 424,
          "total_us": 8019.653,
          "mean_us": 18.91428,
          "p50_us": 19.159,
          "p95_us": 20.757,
          "core": "MIX_AIV",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 424,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 13.09,
              "MTE3": 15.39,
              "Vector": 10.79,
              "Cube": 0.0,
              "Scalar": 30.09,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 8,
          "calls": 424,
          "total_us": 8643.764,
          "mean_us": 20.38624,
          "p50_us": 20.6495,
          "p95_us": 22.49,
          "core": "MIX_AIV",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 424,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 13.34,
              "MTE3": 18.61,
              "Vector": 12.99,
              "Cube": 0.0,
              "Scalar": 29.99,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 16,
          "calls": 322,
          "total_us": 7567.986,
          "mean_us": 23.50306,
          "p50_us": 24.0445,
          "p95_us": 25.558,
          "core": "MIX_AIV",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 322,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 13.41,
              "MTE3": 23.59,
              "Vector": 16.15,
              "Cube": 0.0,
              "Scalar": 29.26,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 17,
          "calls": 322,
          "total_us": 7783.726,
          "mean_us": 24.17306,
          "p50_us": 24.8315,
          "p95_us": 26.339,
          "core": "MIX_AIV",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 322,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 13.32,
              "MTE3": 24.72,
              "Vector": 17.07,
              "Cube": 0.0,
              "Scalar": 29.16,
              "Fixpipe": 0.0
            }
          }
        }
      ]
    },
    {
      "name": "fused_gdn_gating_kernel",
      "points": [
        {
          "batch": 1,
          "calls": 288,
          "total_us": 2625.598,
          "mean_us": 9.11666,
          "p50_us": 9.3695,
          "p95_us": 10.461,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 288,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 9.38,
              "MTE3": 0.25,
              "Vector": 49.8,
              "Cube": 0.0,
              "Scalar": 24.73,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 2,
          "calls": 288,
          "total_us": 3168.176,
          "mean_us": 11.00061,
          "p50_us": 11.1375,
          "p95_us": 12.191,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 288,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 9.38,
              "MTE3": 0.27,
              "Vector": 48.29,
              "Cube": 0.0,
              "Scalar": 24.84,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 4,
          "calls": 288,
          "total_us": 4190.462,
          "mean_us": 14.55022,
          "p50_us": 14.6545,
          "p95_us": 15.726,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 288,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 9.52,
              "MTE3": 0.29,
              "Vector": 47.58,
              "Cube": 0.0,
              "Scalar": 25.33,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 8,
          "calls": 288,
          "total_us": 6303.816,
          "mean_us": 21.88825,
          "p50_us": 21.9095,
          "p95_us": 23.165,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 288,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 9.48,
              "MTE3": 0.32,
              "Vector": 47.12,
              "Cube": 0.0,
              "Scalar": 26.6,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 16,
          "calls": 252,
          "total_us": 6448.073,
          "mean_us": 25.58759,
          "p50_us": 25.5385,
          "p95_us": 28.394,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 252,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 9.43,
              "MTE3": 0.88,
              "Vector": 43.29,
              "Cube": 0.0,
              "Scalar": 30.81,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 17,
          "calls": 252,
          "total_us": 6779.006,
          "mean_us": 26.90082,
          "p50_us": 27.0365,
          "p95_us": 28.186,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 252,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 9.25,
              "MTE3": 1.06,
              "Vector": 42.29,
              "Cube": 0.0,
              "Scalar": 32.04,
              "Fixpipe": 0.0
            }
          }
        }
      ]
    },
    {
      "name": "hcom_allGather_AicpuKernel",
      "points": [
        {
          "batch": 2,
          "calls": 8,
          "total_us": 1830.953,
          "mean_us": 228.86912,
          "p50_us": 176.086,
          "p95_us": 594.339,
          "core": "COMMUNICATION",
          "pipeline": {
            "coverage": 0.0,
            "measured_calls": 0,
            "scores": {}
          }
        },
        {
          "batch": 4,
          "calls": 8,
          "total_us": 1727.162,
          "mean_us": 215.89525,
          "p50_us": 202.897,
          "p95_us": 306.124,
          "core": "COMMUNICATION",
          "pipeline": {
            "coverage": 0.0,
            "measured_calls": 0,
            "scores": {}
          }
        },
        {
          "batch": 8,
          "calls": 48,
          "total_us": 6246.407,
          "mean_us": 130.13348,
          "p50_us": 107.639,
          "p95_us": 186.17,
          "core": "COMMUNICATION",
          "pipeline": {
            "coverage": 0.0,
            "measured_calls": 0,
            "scores": {}
          }
        },
        {
          "batch": 16,
          "calls": 43,
          "total_us": 5933.55,
          "mean_us": 137.98953,
          "p50_us": 122.904,
          "p95_us": 214.11,
          "core": "COMMUNICATION",
          "pipeline": {
            "coverage": 0.0,
            "measured_calls": 0,
            "scores": {}
          }
        },
        {
          "batch": 17,
          "calls": 44,
          "total_us": 6100.971,
          "mean_us": 138.65843,
          "p50_us": 127.696,
          "p95_us": 215.513,
          "core": "COMMUNICATION",
          "pipeline": {
            "coverage": 0.0,
            "measured_calls": 0,
            "scores": {}
          }
        }
      ]
    },
    {
      "name": "Mul",
      "points": [
        {
          "batch": 1,
          "calls": 1848,
          "total_us": 4786.235,
          "mean_us": 2.58995,
          "p50_us": 2.7405,
          "p95_us": 3.712,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 1848,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 26.3,
              "MTE3": 6.53,
              "Vector": 13.87,
              "Cube": 0.0,
              "Scalar": 46.59,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 2,
          "calls": 1848,
          "total_us": 5111.53,
          "mean_us": 2.76598,
          "p50_us": 2.831,
          "p95_us": 3.837,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 1848,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 26.97,
              "MTE3": 6.52,
              "Vector": 13.67,
              "Cube": 0.0,
              "Scalar": 45.44,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 4,
          "calls": 1848,
          "total_us": 5281.411,
          "mean_us": 2.85791,
          "p50_us": 2.8825,
          "p95_us": 3.989,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 1848,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 27.03,
              "MTE3": 6.5,
              "Vector": 13.81,
              "Cube": 0.0,
              "Scalar": 45.57,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 8,
          "calls": 1848,
          "total_us": 5558.932,
          "mean_us": 3.00808,
          "p50_us": 3.03,
          "p95_us": 4.318,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 1848,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 26.67,
              "MTE3": 6.65,
              "Vector": 13.91,
              "Cube": 0.0,
              "Scalar": 45.19,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 16,
          "calls": 1666,
          "total_us": 5784.46,
          "mean_us": 3.47206,
          "p50_us": 3.3375,
          "p95_us": 5.592,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 1666,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 26.52,
              "MTE3": 7.23,
              "Vector": 15.13,
              "Cube": 0.0,
              "Scalar": 44.85,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 17,
          "calls": 1666,
          "total_us": 6031.668,
          "mean_us": 3.62045,
          "p50_us": 3.426,
          "p95_us": 5.732,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 1666,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 27.38,
              "MTE3": 7.73,
              "Vector": 16.03,
              "Cube": 0.0,
              "Scalar": 44.92,
              "Fixpipe": 0.0
            }
          }
        }
      ]
    },
    {
      "name": "MoeDistributeCombineV3",
      "points": [
        {
          "batch": 1,
          "calls": 424,
          "total_us": 4640.13,
          "mean_us": 10.9437,
          "p50_us": 10.8205,
          "p95_us": 12.856,
          "core": "MIX_AIV",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 424,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 19.46,
              "MTE3": 6.37,
              "Vector": 3.99,
              "Cube": 0.0,
              "Scalar": 54.93,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 2,
          "calls": 424,
          "total_us": 4873.98,
          "mean_us": 11.49524,
          "p50_us": 11.55,
          "p95_us": 13.127,
          "core": "MIX_AIV",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 424,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 20.65,
              "MTE3": 10.24,
              "Vector": 4.86,
              "Cube": 0.0,
              "Scalar": 51.06,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 4,
          "calls": 424,
          "total_us": 5064.825,
          "mean_us": 11.94534,
          "p50_us": 12.072,
          "p95_us": 13.284,
          "core": "MIX_AIV",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 424,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 21.56,
              "MTE3": 15.82,
              "Vector": 6.42,
              "Cube": 0.0,
              "Scalar": 46.6,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 8,
          "calls": 424,
          "total_us": 5162.121,
          "mean_us": 12.17481,
          "p50_us": 12.2165,
          "p95_us": 13.498,
          "core": "MIX_AIV",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 424,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 22.89,
              "MTE3": 24.38,
              "Vector": 8.07,
              "Cube": 0.0,
              "Scalar": 41.48,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 16,
          "calls": 322,
          "total_us": 4881.259,
          "mean_us": 15.15919,
          "p50_us": 14.709,
          "p95_us": 20.2,
          "core": "MIX_AIV",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 322,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 24.5,
              "MTE3": 35.74,
              "Vector": 9.94,
              "Cube": 0.0,
              "Scalar": 34.05,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 17,
          "calls": 322,
          "total_us": 5008.611,
          "mean_us": 15.55469,
          "p50_us": 15.2925,
          "p95_us": 20.147,
          "core": "MIX_AIV",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 322,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 25.17,
              "MTE3": 35.52,
              "Vector": 10.33,
              "Cube": 0.0,
              "Scalar": 34.09,
              "Fixpipe": 0.0
            }
          }
        }
      ]
    },
    {
      "name": "_hc_gate_mix_kernel",
      "points": [
        {
          "batch": 1,
          "calls": 896,
          "total_us": 2656.526,
          "mean_us": 2.96487,
          "p50_us": 2.936,
          "p95_us": 3.684,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 896,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 26.45,
              "MTE3": 8.07,
              "Vector": 12.26,
              "Cube": 0.0,
              "Scalar": 37.43,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 2,
          "calls": 896,
          "total_us": 3572.38,
          "mean_us": 3.98703,
          "p50_us": 3.8825,
          "p95_us": 5.133,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 896,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 21.9,
              "MTE3": 6.36,
              "Vector": 11.63,
              "Cube": 0.0,
              "Scalar": 32.1,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 4,
          "calls": 896,
          "total_us": 4029.543,
          "mean_us": 4.49726,
          "p50_us": 4.4215,
          "p95_us": 5.595,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 896,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 28.07,
              "MTE3": 9.86,
              "Vector": 15.39,
              "Cube": 0.0,
              "Scalar": 36.23,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 8,
          "calls": 896,
          "total_us": 4677.763,
          "mean_us": 5.22072,
          "p50_us": 5.4385,
          "p95_us": 6.096,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 896,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 36.46,
              "MTE3": 16.06,
              "Vector": 22.36,
              "Cube": 0.0,
              "Scalar": 44.6,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 16,
          "calls": 784,
          "total_us": 6762.523,
          "mean_us": 8.62567,
          "p50_us": 7.2225,
          "p95_us": 21.413,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 784,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 59.65,
              "MTE3": 29.78,
              "Vector": 34.56,
              "Cube": 0.0,
              "Scalar": 62.72,
              "Fixpipe": 0.0
            }
          }
        },
        {
          "batch": 17,
          "calls": 684,
          "total_us": 4803.597,
          "mean_us": 7.0228,
          "p50_us": 7.3295,
          "p95_us": 7.857,
          "core": "AI_VECTOR_CORE",
          "pipeline": {
            "coverage": 100.0,
            "measured_calls": 684,
            "scores": {
              "MTE1": 0.0,
              "MTE2": 47.79,
              "MTE3": 22.56,
              "Vector": 30.08,
              "Cube": 0.0,
              "Scalar": 53.22,
              "Fixpipe": 0.0
            }
          }
        }
      ]
    }
  ],
  "verified": [
    {
      "batch": 1,
      "submitted_batch": 1,
      "kernel_csv": "profiles/Batch1_Qwen4Exp_dp0_pp0_tp0_dcp0_ep0_rank0_196_20261124095754401_ascend_pt/ASCEND_PROFILER_OUTPUT/kernel_details.csv",
      "observed": {
        "1": 8
      },
      "steps": 8,
      "kernel_calls": 34663
    },
    {
      "batch": 2,
      "submitted_batch": 2,
      "kernel_csv": "profiles/Batch1_Qwen4Exp_dp0_pp0_tp0_dcp0_ep0_rank0_196_20261124095833837_ascend_pt/ASCEND_PROFILER_OUTPUT/kernel_details.csv",
      "observed": {
        "2": 8
      },
      "steps": 8,
      "kernel_calls": 35223
    },
    {
      "batch": 4,
      "submitted_batch": 4,
      "kernel_csv": "profiles/Batch1_Qwen4Exp_dp0_pp0_tp0_dcp0_ep0_rank0_196_20261124095856056_ascend_pt/ASCEND_PROFILER_OUTPUT/kernel_details.csv",
      "observed": {
        "4": 8
      },
      "steps": 8,
      "kernel_calls": 35143
    },
    {
      "batch": 8,
      "submitted_batch": 8,
      "kernel_csv": "profiles/Batch1_Qwen4Exp_dp0_pp0_tp0_dcp0_ep0_rank0_196_20261124095924877_ascend_pt/ASCEND_PROFILER_OUTPUT/kernel_details.csv",
      "observed": {
        "8": 8
      },
      "steps": 8,
      "kernel_calls": 35143
    },
    {
      "batch": 16,
      "submitted_batch": 16,
      "kernel_csv": "profiles/Batch1_Qwen4Exp_dp0_pp0_tp0_dcp0_ep0_rank0_196_20261124095949215_ascend_pt/ASCEND_PROFILER_OUTPUT/kernel_details.csv",
      "observed": {
        "15": 1,
        "16": 7
      },
      "steps": 7,
      "kernel_calls": 31670
    },
    {
      "batch": 17,
      "submitted_batch": 32,
      "kernel_csv": "profiles/Batch1_Qwen4Exp_dp0_pp0_tp0_dcp0_ep0_rank0_196_20261124100022976_ascend_pt/ASCEND_PROFILER_OUTPUT/kernel_details.csv",
      "observed": {
        "15": 1,
        "17": 7
      },
      "steps": 7,
      "kernel_calls": 31796
    }
  ],
  "failures": {},
  "sort_batch": 17,
  "comparison": {
    "context": "104 · W8A8 · TP4 / EP4 · HCCL AIV · 128K 热前缀 → 96。MTP5 用 NPU 4–7，关闭用 NPU 0–3。每档各一次正式跑分。",
    "perf": [
      {
        "batch": 1,
        "input_tokens_per_request": 131072,
        "output_tokens_per_request": 96,
        "ttft_mean_ms": 331.4352,
        "tpot_mean_ms": 238.88004,
        "decoded_tokens_per_s": 4.1862,
        "itl_mean_ms": 239.79014,
        "itl_samples": 95,
        "drafted": 0,
        "accepted": 0,
        "acceptance_rate": null
      },
      {
        "batch": 4,
        "input_tokens_per_request": 131072,
        "output_tokens_per_request": 96,
        "ttft_mean_ms": 3613.60235,
        "tpot_mean_ms": 256.31837,
        "decoded_tokens_per_s": 13.73549,
        "itl_mean_ms": 258.37842,
        "itl_samples": 380,
        "drafted": 0,
        "accepted": 0,
        "acceptance_rate": null
      },
      {
        "batch": 8,
        "input_tokens_per_request": 131072,
        "output_tokens_per_request": 96,
        "ttft_mean_ms": 1435.77099,
        "tpot_mean_ms": 253.77572,
        "decoded_tokens_per_s": 30.32973,
        "itl_mean_ms": 258.44513,
        "itl_samples": 760,
        "drafted": 0,
        "accepted": 0,
        "acceptance_rate": null
      }
    ],
    "verified": [
      {
        "batch": 1,
        "submitted_batch": 1,
        "steps": 8,
        "kernel_calls": 22710
      },
      {
        "batch": 4,
        "submitted_batch": 4,
        "steps": 8,
        "kernel_calls": 25030
      },
      {
        "batch": 8,
        "submitted_batch": 8,
        "steps": 8,
        "kernel_calls": 25030
      }
    ],
    "kernels": [
      {
        "name": "hcom_allReduce_",
        "points": [
          {
            "batch": 1,
            "calls": 1568,
            "total_us": 22195.602,
            "mean_us": 14.15536,
            "p50_us": 14.068,
            "p95_us": 14.78,
            "core": "COMMUNICATION",
            "pipeline": {
              "coverage": 50.0,
              "measured_calls": 784,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 9.48,
                "MTE3": 19.22,
                "Vector": 0.0,
                "Cube": 0.0,
                "Scalar": 18.14,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 1568,
            "total_us": 24111.506,
            "mean_us": 15.37724,
            "p50_us": 15.193,
            "p95_us": 16.194,
            "core": "COMMUNICATION",
            "pipeline": {
              "coverage": 50.0,
              "measured_calls": 784,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 9.69,
                "MTE3": 20.01,
                "Vector": 0.0,
                "Cube": 0.0,
                "Scalar": 16.87,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 1568,
            "total_us": 26709.192,
            "mean_us": 17.03392,
            "p50_us": 16.8685,
            "p95_us": 17.782,
            "core": "COMMUNICATION",
            "pipeline": {
              "coverage": 50.0,
              "measured_calls": 784,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 9.9,
                "MTE3": 20.86,
                "Vector": 0.0,
                "Cube": 0.0,
                "Scalar": 15.07,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      },
      {
        "name": "MatMulV3",
        "points": [
          {
            "batch": 1,
            "calls": 3968,
            "total_us": 23414.656,
            "mean_us": 5.90087,
            "p50_us": 5.799,
            "p95_us": 10.454,
            "core": "AI_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 3968,
              "scores": {
                "MTE1": 15.09,
                "MTE2": 52.16,
                "MTE3": 0.05,
                "Vector": 0.04,
                "Cube": 12.17,
                "Scalar": 39.74,
                "Fixpipe": 30.58
              }
            }
          },
          {
            "batch": 4,
            "calls": 3968,
            "total_us": 24351.394,
            "mean_us": 6.13694,
            "p50_us": 5.991,
            "p95_us": 10.99,
            "core": "AI_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 3968,
              "scores": {
                "MTE1": 14.58,
                "MTE2": 53.44,
                "MTE3": 0.11,
                "Vector": 0.17,
                "Cube": 11.71,
                "Scalar": 38.29,
                "Fixpipe": 32.31
              }
            }
          },
          {
            "batch": 8,
            "calls": 3968,
            "total_us": 24851.9,
            "mean_us": 6.26308,
            "p50_us": 6.086,
            "p95_us": 11.224,
            "core": "AI_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 3968,
              "scores": {
                "MTE1": 14.33,
                "MTE2": 54.79,
                "MTE3": 0.19,
                "Vector": 0.39,
                "Cube": 11.42,
                "Scalar": 37.06,
                "Fixpipe": 33.58
              }
            }
          }
        ]
      },
      {
        "name": "GroupedMatmulSwigluQuantV2",
        "points": [
          {
            "batch": 1,
            "calls": 384,
            "total_us": 9134.189,
            "mean_us": 23.78695,
            "p50_us": 24.057,
            "p95_us": 27.027,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 384,
              "scores": {
                "MTE1": 6.57,
                "MTE2": 16.01,
                "MTE3": 0.12,
                "Vector": 0.09,
                "Cube": 5.92,
                "Scalar": 83.57,
                "Fixpipe": 0.17
              }
            }
          },
          {
            "batch": 4,
            "calls": 384,
            "total_us": 9649.767,
            "mean_us": 25.1296,
            "p50_us": 25.1655,
            "p95_us": 27.969,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 384,
              "scores": {
                "MTE1": 9.23,
                "MTE2": 22.38,
                "MTE3": 0.64,
                "Vector": 0.28,
                "Cube": 8.31,
                "Scalar": 80.85,
                "Fixpipe": 0.24
              }
            }
          },
          {
            "batch": 8,
            "calls": 384,
            "total_us": 10071.863,
            "mean_us": 26.22881,
            "p50_us": 26.316,
            "p95_us": 29.543,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 384,
              "scores": {
                "MTE1": 8.76,
                "MTE2": 22.83,
                "MTE3": 1.7,
                "Vector": 0.46,
                "Cube": 8.26,
                "Scalar": 81.01,
                "Fixpipe": 0.24
              }
            }
          }
        ]
      },
      {
        "name": "hcom_allGather_",
        "points": [
          {
            "batch": 1,
            "calls": 784,
            "total_us": 8756.13,
            "mean_us": 11.16853,
            "p50_us": 10.8615,
            "p95_us": 12.364,
            "core": "COMMUNICATION",
            "pipeline": {
              "coverage": 50.0,
              "measured_calls": 392,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 3.0,
                "MTE3": 1.78,
                "Vector": 0.0,
                "Cube": 0.0,
                "Scalar": 29.93,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 784,
            "total_us": 9155.298,
            "mean_us": 11.67768,
            "p50_us": 11.037,
            "p95_us": 12.49,
            "core": "COMMUNICATION",
            "pipeline": {
              "coverage": 50.0,
              "measured_calls": 392,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 3.3,
                "MTE3": 1.75,
                "Vector": 0.0,
                "Cube": 0.0,
                "Scalar": 28.55,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 768,
            "total_us": 8663.574,
            "mean_us": 11.2807,
            "p50_us": 11.0805,
            "p95_us": 12.416,
            "core": "COMMUNICATION",
            "pipeline": {
              "coverage": 50.0,
              "measured_calls": 384,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 2.89,
                "MTE3": 1.68,
                "Vector": 0.0,
                "Cube": 0.0,
                "Scalar": 29.39,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      },
      {
        "name": "GroupedMatmul",
        "points": [
          {
            "batch": 1,
            "calls": 384,
            "total_us": 6634.211,
            "mean_us": 17.27659,
            "p50_us": 17.1525,
            "p95_us": 18.803,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 384,
              "scores": {
                "MTE1": 2.72,
                "MTE2": 8.02,
                "MTE3": 0.34,
                "Vector": 0.11,
                "Cube": 2.33,
                "Scalar": 92.78,
                "Fixpipe": 5.55
              }
            }
          },
          {
            "batch": 4,
            "calls": 384,
            "total_us": 6963.17,
            "mean_us": 18.13326,
            "p50_us": 18.118,
            "p95_us": 20.359,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 384,
              "scores": {
                "MTE1": 4.16,
                "MTE2": 12.1,
                "MTE3": 1.15,
                "Vector": 0.42,
                "Cube": 3.59,
                "Scalar": 92.9,
                "Fixpipe": 8.67
              }
            }
          },
          {
            "batch": 8,
            "calls": 384,
            "total_us": 6982.569,
            "mean_us": 18.18377,
            "p50_us": 18.1335,
            "p95_us": 20.408,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 384,
              "scores": {
                "MTE1": 4.04,
                "MTE2": 12.07,
                "MTE3": 2.09,
                "Vector": 0.84,
                "Cube": 3.54,
                "Scalar": 92.73,
                "Fixpipe": 8.61
              }
            }
          }
        ]
      },
      {
        "name": "MoeDistributeDispatchV3",
        "points": [
          {
            "batch": 1,
            "calls": 384,
            "total_us": 6073.891,
            "mean_us": 15.81742,
            "p50_us": 15.6055,
            "p95_us": 17.387,
            "core": "MIX_AIV",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 384,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 11.94,
                "MTE3": 11.34,
                "Vector": 8.81,
                "Cube": 0.0,
                "Scalar": 32.15,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 384,
            "total_us": 6271.807,
            "mean_us": 16.33283,
            "p50_us": 16.266,
            "p95_us": 18.036,
            "core": "MIX_AIV",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 384,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 12.07,
                "MTE3": 11.66,
                "Vector": 8.82,
                "Cube": 0.0,
                "Scalar": 31.7,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 384,
            "total_us": 6415.107,
            "mean_us": 16.70601,
            "p50_us": 16.5985,
            "p95_us": 18.42,
            "core": "MIX_AIV",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 384,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 12.07,
                "MTE3": 12.45,
                "Vector": 9.27,
                "Cube": 0.0,
                "Scalar": 31.64,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      },
      {
        "name": "Slice",
        "points": [
          {
            "batch": 1,
            "calls": 192,
            "total_us": 414.183,
            "mean_us": 2.1572,
            "p50_us": 2.08,
            "p95_us": 2.672,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 192,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 25.17,
                "MTE3": 12.43,
                "Vector": 0.0,
                "Cube": 0.0,
                "Scalar": 32.77,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 2496,
            "total_us": 5214.356,
            "mean_us": 2.08908,
            "p50_us": 1.922,
            "p95_us": 3.268,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 2496,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 27.64,
                "MTE3": 10.66,
                "Vector": 0.0,
                "Cube": 0.0,
                "Scalar": 35.83,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 2496,
            "total_us": 5627.141,
            "mean_us": 2.25446,
            "p50_us": 2.013,
            "p95_us": 3.79,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 2496,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 27.86,
                "MTE3": 10.06,
                "Vector": 0.0,
                "Cube": 0.0,
                "Scalar": 35.67,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      },
      {
        "name": "LightningIndexerV2",
        "points": [
          {
            "batch": 1,
            "calls": 96,
            "total_us": 1892.802,
            "mean_us": 19.71669,
            "p50_us": 19.6635,
            "p95_us": 20.829,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 96,
              "scores": {
                "MTE1": 9.41,
                "MTE2": 48.56,
                "MTE3": 3.04,
                "Vector": 4.11,
                "Cube": 8.02,
                "Scalar": 54.07,
                "Fixpipe": 3.53
              }
            }
          },
          {
            "batch": 4,
            "calls": 96,
            "total_us": 2615.185,
            "mean_us": 27.24151,
            "p50_us": 27.255,
            "p95_us": 28.33,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 96,
              "scores": {
                "MTE1": 18.49,
                "MTE2": 76.33,
                "MTE3": 7.9,
                "Vector": 6.86,
                "Cube": 14.5,
                "Scalar": 52.0,
                "Fixpipe": 6.36
              }
            }
          },
          {
            "batch": 8,
            "calls": 96,
            "total_us": 4240.953,
            "mean_us": 44.17659,
            "p50_us": 44.0745,
            "p95_us": 45.551,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 96,
              "scores": {
                "MTE1": 20.66,
                "MTE2": 86.64,
                "MTE3": 9.64,
                "Vector": 7.47,
                "Cube": 16.1,
                "Scalar": 48.7,
                "Fixpipe": 7.06
              }
            }
          }
        ]
      },
      {
        "name": "MoeDistributeCombineV3",
        "points": [
          {
            "batch": 1,
            "calls": 384,
            "total_us": 3881.658,
            "mean_us": 10.10848,
            "p50_us": 9.909,
            "p95_us": 11.963,
            "core": "MIX_AIV",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 384,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 18.44,
                "MTE3": 2.63,
                "Vector": 3.02,
                "Cube": 0.0,
                "Scalar": 60.22,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 384,
            "total_us": 3948.64,
            "mean_us": 10.28292,
            "p50_us": 9.997,
            "p95_us": 12.391,
            "core": "MIX_AIV",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 384,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 18.6,
                "MTE3": 5.6,
                "Vector": 3.26,
                "Cube": 0.0,
                "Scalar": 57.56,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 384,
            "total_us": 4125.843,
            "mean_us": 10.74438,
            "p50_us": 10.4845,
            "p95_us": 12.694,
            "core": "MIX_AIV",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 384,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 19.0,
                "MTE3": 8.41,
                "Vector": 4.15,
                "Cube": 0.0,
                "Scalar": 54.57,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      },
      {
        "name": "Mul",
        "points": [
          {
            "batch": 1,
            "calls": 1304,
            "total_us": 2603.574,
            "mean_us": 1.99661,
            "p50_us": 2.028,
            "p95_us": 3.047,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 1304,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 19.81,
                "MTE3": 10.91,
                "Vector": 14.57,
                "Cube": 0.0,
                "Scalar": 49.82,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 1304,
            "total_us": 3623.858,
            "mean_us": 2.77903,
            "p50_us": 2.926,
            "p95_us": 3.582,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 1304,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 28.36,
                "MTE3": 6.5,
                "Vector": 13.98,
                "Cube": 0.0,
                "Scalar": 45.49,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 1304,
            "total_us": 3772.857,
            "mean_us": 2.8933,
            "p50_us": 3.005,
            "p95_us": 3.717,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 1304,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 28.14,
                "MTE3": 7.01,
                "Vector": 14.21,
                "Cube": 0.0,
                "Scalar": 45.1,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      },
      {
        "name": "GenericBlockSparseAttention",
        "points": [
          {
            "batch": 1,
            "calls": 96,
            "total_us": 2978.72,
            "mean_us": 31.02833,
            "p50_us": 31.0275,
            "p95_us": 32.367,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 96,
              "scores": {
                "MTE1": 1.25,
                "MTE2": 13.09,
                "MTE3": 1.33,
                "Vector": 1.81,
                "Cube": 1.6,
                "Scalar": 46.13,
                "Fixpipe": 0.63
              }
            }
          },
          {
            "batch": 4,
            "calls": 96,
            "total_us": 3047.793,
            "mean_us": 31.74784,
            "p50_us": 31.776,
            "p95_us": 33.143,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 96,
              "scores": {
                "MTE1": 3.15,
                "MTE2": 27.51,
                "MTE3": 1.74,
                "Vector": 2.26,
                "Cube": 2.93,
                "Scalar": 40.23,
                "Fixpipe": 0.64
              }
            }
          },
          {
            "batch": 8,
            "calls": 96,
            "total_us": 3677.342,
            "mean_us": 38.30565,
            "p50_us": 38.2205,
            "p95_us": 40.034,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 96,
              "scores": {
                "MTE1": 4.86,
                "MTE2": 41.51,
                "MTE3": 2.3,
                "Vector": 2.86,
                "Cube": 4.52,
                "Scalar": 39.2,
                "Fixpipe": 0.73
              }
            }
          }
        ]
      },
      {
        "name": "RecurrentGatedDeltaRule",
        "points": [
          {
            "batch": 1,
            "calls": 288,
            "total_us": 1643.535,
            "mean_us": 5.70672,
            "p50_us": 5.6715,
            "p95_us": 6.063,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 288,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 37.6,
                "MTE3": 13.35,
                "Vector": 31.81,
                "Cube": 0.0,
                "Scalar": 46.55,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 288,
            "total_us": 2120.684,
            "mean_us": 7.36349,
            "p50_us": 7.2945,
            "p95_us": 8.145,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 288,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 32.61,
                "MTE3": 10.42,
                "Vector": 27.8,
                "Cube": 0.0,
                "Scalar": 53.02,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 288,
            "total_us": 2984.594,
            "mean_us": 10.36317,
            "p50_us": 10.2465,
            "p95_us": 11.39,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 288,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 35.41,
                "MTE3": 12.52,
                "Vector": 30.43,
                "Cube": 0.0,
                "Scalar": 58.04,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      },
      {
        "name": "_hc_combine_norm_kernel",
        "points": [
          {
            "batch": 1,
            "calls": 760,
            "total_us": 2479.971,
            "mean_us": 3.26312,
            "p50_us": 3.226,
            "p95_us": 3.55,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 760,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 26.59,
                "MTE3": 14.59,
                "Vector": 36.72,
                "Cube": 0.0,
                "Scalar": 27.99,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 760,
            "total_us": 2680.578,
            "mean_us": 3.52708,
            "p50_us": 3.496,
            "p95_us": 3.821,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 760,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 21.32,
                "MTE3": 14.22,
                "Vector": 37.55,
                "Cube": 0.0,
                "Scalar": 26.95,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 760,
            "total_us": 2910.82,
            "mean_us": 3.83003,
            "p50_us": 3.786,
            "p95_us": 4.239,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 760,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 15.57,
                "MTE3": 12.61,
                "Vector": 39.0,
                "Cube": 0.0,
                "Scalar": 28.62,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      },
      {
        "name": "fused_gdn_gating_kernel",
        "points": [
          {
            "batch": 1,
            "calls": 288,
            "total_us": 2045.174,
            "mean_us": 7.1013,
            "p50_us": 6.981,
            "p95_us": 8.251,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 288,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 9.29,
                "MTE3": 0.09,
                "Vector": 52.25,
                "Cube": 0.0,
                "Scalar": 25.37,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 288,
            "total_us": 2424.271,
            "mean_us": 8.41761,
            "p50_us": 8.6715,
            "p95_us": 9.738,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 288,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 9.31,
                "MTE3": 0.19,
                "Vector": 50.61,
                "Cube": 0.0,
                "Scalar": 25.22,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 288,
            "total_us": 2745.693,
            "mean_us": 9.53366,
            "p50_us": 9.6185,
            "p95_us": 10.919,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 288,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 9.39,
                "MTE3": 0.28,
                "Vector": 50.87,
                "Cube": 0.0,
                "Scalar": 25.58,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      },
      {
        "name": "Index",
        "points": [
          {
            "batch": 1,
            "calls": 360,
            "total_us": 2475.666,
            "mean_us": 6.87685,
            "p50_us": 2.7835,
            "p95_us": 3.315,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 36.82,
              "measured_calls": 352,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 16.92,
                "MTE3": 1.67,
                "Vector": 26.43,
                "Cube": 0.0,
                "Scalar": 40.98,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 360,
            "total_us": 2464.385,
            "mean_us": 6.84551,
            "p50_us": 2.8175,
            "p95_us": 3.415,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 37.83,
              "measured_calls": 352,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 16.9,
                "MTE3": 1.78,
                "Vector": 27.21,
                "Cube": 0.0,
                "Scalar": 40.47,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 360,
            "total_us": 2731.41,
            "mean_us": 7.58725,
            "p50_us": 2.8905,
            "p95_us": 3.426,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 34.56,
              "measured_calls": 352,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 16.97,
                "MTE3": 1.92,
                "Vector": 28.35,
                "Cube": 0.0,
                "Scalar": 39.74,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      },
      {
        "name": "_hc_gate_mix_kernel",
        "points": [
          {
            "batch": 1,
            "calls": 776,
            "total_us": 1754.638,
            "mean_us": 2.26113,
            "p50_us": 2.23,
            "p95_us": 2.541,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 776,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 31.48,
                "MTE3": 9.16,
                "Vector": 11.78,
                "Cube": 0.0,
                "Scalar": 41.8,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 776,
            "total_us": 2120.618,
            "mean_us": 2.73276,
            "p50_us": 2.6845,
            "p95_us": 3.18,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 776,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 28.36,
                "MTE3": 8.99,
                "Vector": 12.12,
                "Cube": 0.0,
                "Scalar": 38.62,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 776,
            "total_us": 2551.893,
            "mean_us": 3.28852,
            "p50_us": 3.21,
            "p95_us": 3.881,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 776,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 25.48,
                "MTE3": 7.71,
                "Vector": 11.29,
                "Cube": 0.0,
                "Scalar": 36.33,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      }
    ]
  },
  "a3": {
    "perf": [
      {
        "batch": 1,
        "input_tokens_per_request": 131072,
        "output_tokens_per_request": 96,
        "ttft_mean_ms": 664.5911,
        "tpot_mean_ms": 75.22066,
        "decoded_tokens_per_s": 13.29422,
        "itl_mean_ms": 361.40875,
        "itl_samples": 20,
        "drafted": 100,
        "accepted": 79,
        "acceptance_rate": 0.79,
        "prefix_cache_queries": 131072,
        "prefix_cache_hits": 130560
      },
      {
        "batch": 4,
        "input_tokens_per_request": 131072,
        "output_tokens_per_request": 96,
        "ttft_mean_ms": 1192.25328,
        "tpot_mean_ms": 77.59462,
        "decoded_tokens_per_s": 44.90718,
        "itl_mean_ms": 382.92945,
        "itl_samples": 79,
        "drafted": 395,
        "accepted": 309,
        "acceptance_rate": 0.78228,
        "prefix_cache_queries": 524288,
        "prefix_cache_hits": 522240
      },
      {
        "batch": 8,
        "input_tokens_per_request": 131072,
        "output_tokens_per_request": 96,
        "ttft_mean_ms": 2314.0911,
        "tpot_mean_ms": 75.95778,
        "decoded_tokens_per_s": 77.16842,
        "itl_mean_ms": 379.09989,
        "itl_samples": 164,
        "drafted": 820,
        "accepted": 621,
        "acceptance_rate": 0.75732,
        "prefix_cache_queries": 1048576,
        "prefix_cache_hits": 1044480
      }
    ],
    "kernels": [
      {
        "name": "MatMulV2",
        "points": [
          {
            "batch": 1,
            "calls": 4224,
            "total_us": 51852.929,
            "mean_us": 12.27579,
            "p50_us": 10.78,
            "p95_us": 15.56,
            "core": "AI_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 4224,
              "scores": {
                "MTE1": 15.52,
                "MTE2": 53.11,
                "MTE3": 0.0,
                "Vector": 0.0,
                "Cube": 7.55,
                "Scalar": 40.03,
                "Fixpipe": 3.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 4224,
            "total_us": 60481.148,
            "mean_us": 14.31845,
            "p50_us": 12.32,
            "p95_us": 19.661,
            "core": "AI_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 4224,
              "scores": {
                "MTE1": 16.84,
                "MTE2": 54.81,
                "MTE3": 0.0,
                "Vector": 0.0,
                "Cube": 9.49,
                "Scalar": 53.15,
                "Fixpipe": 3.96
              }
            }
          },
          {
            "batch": 8,
            "calls": 4224,
            "total_us": 68721.153,
            "mean_us": 16.26921,
            "p50_us": 12.4505,
            "p95_us": 23.58,
            "core": "AI_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 4224,
              "scores": {
                "MTE1": 21.43,
                "MTE2": 66.13,
                "MTE3": 0.0,
                "Vector": 0.0,
                "Cube": 12.5,
                "Scalar": 42.35,
                "Fixpipe": 4.73
              }
            }
          }
        ]
      },
      {
        "name": "GenericBlockSparseAttention",
        "points": [
          {
            "batch": 1,
            "calls": 136,
            "total_us": 10234.827,
            "mean_us": 75.25608,
            "p50_us": 78.232,
            "p95_us": 94.221,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 136,
              "scores": {
                "MTE1": 2.63,
                "MTE2": 38.81,
                "MTE3": 0.64,
                "Vector": 1.29,
                "Cube": 1.16,
                "Scalar": 56.16,
                "Fixpipe": 1.56
              }
            }
          },
          {
            "batch": 4,
            "calls": 136,
            "total_us": 19133.922,
            "mean_us": 140.6906,
            "p50_us": 156.023,
            "p95_us": 180.844,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 136,
              "scores": {
                "MTE1": 5.6,
                "MTE2": 62.52,
                "MTE3": 0.76,
                "Vector": 2.18,
                "Cube": 2.46,
                "Scalar": 58.85,
                "Fixpipe": 3.18
              }
            }
          },
          {
            "batch": 8,
            "calls": 136,
            "total_us": 31594.972,
            "mean_us": 232.31597,
            "p50_us": 248.215,
            "p95_us": 278.005,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 136,
              "scores": {
                "MTE1": 6.74,
                "MTE2": 66.91,
                "MTE3": 0.8,
                "Vector": 2.54,
                "Cube": 2.97,
                "Scalar": 57.41,
                "Fixpipe": 3.59
              }
            }
          }
        ]
      },
      {
        "name": "GroupedMatmulSwigluQuant",
        "points": [
          {
            "batch": 1,
            "calls": 384,
            "total_us": 15783.369,
            "mean_us": 41.10252,
            "p50_us": 40.08,
            "p95_us": 50.601,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 384,
              "scores": {
                "MTE1": 8.08,
                "MTE2": 19.58,
                "MTE3": 0.12,
                "Vector": 0.2,
                "Cube": 2.9,
                "Scalar": 48.38,
                "Fixpipe": 3.48
              }
            }
          },
          {
            "batch": 4,
            "calls": 384,
            "total_us": 19682.766,
            "mean_us": 51.2572,
            "p50_us": 50.751,
            "p95_us": 66.601,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 384,
              "scores": {
                "MTE1": 9.98,
                "MTE2": 25.65,
                "MTE3": 0.5,
                "Vector": 0.47,
                "Cube": 3.64,
                "Scalar": 54.01,
                "Fixpipe": 4.75
              }
            }
          },
          {
            "batch": 8,
            "calls": 384,
            "total_us": 23840.715,
            "mean_us": 62.0852,
            "p50_us": 61.9215,
            "p95_us": 79.522,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 384,
              "scores": {
                "MTE1": 14.06,
                "MTE2": 34.08,
                "MTE3": 0.81,
                "Vector": 0.73,
                "Cube": 5.21,
                "Scalar": 48.5,
                "Fixpipe": 7.26
              }
            }
          }
        ]
      },
      {
        "name": "hcom_allReduce_",
        "points": [
          {
            "batch": 1,
            "calls": 1808,
            "total_us": 13365.198,
            "mean_us": 7.39226,
            "p50_us": 7.4,
            "p95_us": 7.96,
            "core": "COMMUNICATION",
            "pipeline": {
              "coverage": 50.0,
              "measured_calls": 904,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 23.96,
                "MTE3": 6.84,
                "Vector": 0.3,
                "Cube": 0.0,
                "Scalar": 28.38,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 1808,
            "total_us": 17523.582,
            "mean_us": 9.69225,
            "p50_us": 9.84,
            "p95_us": 10.581,
            "core": "COMMUNICATION",
            "pipeline": {
              "coverage": 50.0,
              "measured_calls": 904,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 35.08,
                "MTE3": 16.22,
                "Vector": 0.35,
                "Cube": 0.0,
                "Scalar": 27.22,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 1808,
            "total_us": 19992.594,
            "mean_us": 11.05785,
            "p50_us": 11.26,
            "p95_us": 12.021,
            "core": "COMMUNICATION",
            "pipeline": {
              "coverage": 50.0,
              "measured_calls": 904,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 36.94,
                "MTE3": 17.09,
                "Vector": 0.3,
                "Cube": 0.0,
                "Scalar": 23.99,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      },
      {
        "name": "MoeDistributeDispatchV2",
        "points": [
          {
            "batch": 1,
            "calls": 424,
            "total_us": 17936.64,
            "mean_us": 42.3034,
            "p50_us": 41.67,
            "p95_us": 46.721,
            "core": "MIX_AIV",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 424,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 5.71,
                "MTE3": 7.05,
                "Vector": 3.89,
                "Cube": 0.0,
                "Scalar": 12.95,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 424,
            "total_us": 18587.19,
            "mean_us": 43.83771,
            "p50_us": 43.501,
            "p95_us": 47.561,
            "core": "MIX_AIV",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 424,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 7.49,
                "MTE3": 7.09,
                "Vector": 4.09,
                "Cube": 0.0,
                "Scalar": 12.94,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 424,
            "total_us": 19235.127,
            "mean_us": 45.36587,
            "p50_us": 45.561,
            "p95_us": 47.761,
            "core": "MIX_AIV",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 424,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 7.79,
                "MTE3": 7.86,
                "Vector": 4.43,
                "Cube": 0.0,
                "Scalar": 13.23,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      },
      {
        "name": "LightningIndexerV2",
        "points": [
          {
            "batch": 1,
            "calls": 136,
            "total_us": 10424.842,
            "mean_us": 76.65325,
            "p50_us": 85.7815,
            "p95_us": 88.502,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 136,
              "scores": {
                "MTE1": 2.38,
                "MTE2": 16.02,
                "MTE3": 1.65,
                "Vector": 15.36,
                "Cube": 1.3,
                "Scalar": 29.2,
                "Fixpipe": 17.18
              }
            }
          },
          {
            "batch": 4,
            "calls": 136,
            "total_us": 12882.397,
            "mean_us": 94.72351,
            "p50_us": 103.0025,
            "p95_us": 114.623,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 136,
              "scores": {
                "MTE1": 7.76,
                "MTE2": 45.3,
                "MTE3": 1.63,
                "Vector": 41.54,
                "Cube": 4.21,
                "Scalar": 57.63,
                "Fixpipe": 48.72
              }
            }
          },
          {
            "batch": 8,
            "calls": 136,
            "total_us": 16674.304,
            "mean_us": 122.60518,
            "p50_us": 134.4225,
            "p95_us": 135.863,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 136,
              "scores": {
                "MTE1": 12.07,
                "MTE2": 32.19,
                "MTE3": 1.1,
                "Vector": 61.58,
                "Cube": 6.51,
                "Scalar": 49.62,
                "Fixpipe": 37.82
              }
            }
          }
        ]
      },
      {
        "name": "Slice",
        "points": [
          {
            "batch": 1,
            "calls": 4632,
            "total_us": 9696.268,
            "mean_us": 2.09332,
            "p50_us": 2.04,
            "p95_us": 2.86,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 4632,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 6.8,
                "MTE3": 7.72,
                "Vector": 0.62,
                "Cube": 0.0,
                "Scalar": 25.09,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 5432,
            "total_us": 14636.142,
            "mean_us": 2.69443,
            "p50_us": 2.58,
            "p95_us": 4.34,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 5432,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 5.33,
                "MTE3": 5.41,
                "Vector": 0.88,
                "Cube": 0.0,
                "Scalar": 27.74,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 5432,
            "total_us": 15748.011,
            "mean_us": 2.89912,
            "p50_us": 2.9,
            "p95_us": 4.26,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 5432,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 6.15,
                "MTE3": 5.57,
                "Vector": 0.85,
                "Cube": 0.0,
                "Scalar": 23.1,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      },
      {
        "name": "GroupedMatmul",
        "points": [
          {
            "batch": 1,
            "calls": 464,
            "total_us": 12342.09,
            "mean_us": 26.59933,
            "p50_us": 26.751,
            "p95_us": 32.881,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 464,
              "scores": {
                "MTE1": 6.59,
                "MTE2": 13.26,
                "MTE3": 0.69,
                "Vector": 0.79,
                "Cube": 2.42,
                "Scalar": 49.96,
                "Fixpipe": 6.34
              }
            }
          },
          {
            "batch": 4,
            "calls": 464,
            "total_us": 12535.374,
            "mean_us": 27.01589,
            "p50_us": 25.661,
            "p95_us": 33.961,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 464,
              "scores": {
                "MTE1": 10.26,
                "MTE2": 21.78,
                "MTE3": 1.16,
                "Vector": 1.43,
                "Cube": 3.91,
                "Scalar": 49.38,
                "Fixpipe": 10.06
              }
            }
          },
          {
            "batch": 8,
            "calls": 464,
            "total_us": 15589.159,
            "mean_us": 33.59733,
            "p50_us": 32.4305,
            "p95_us": 51.341,
            "core": "MIX_AIC",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 464,
              "scores": {
                "MTE1": 14.73,
                "MTE2": 33.71,
                "MTE3": 1.61,
                "Vector": 2.08,
                "Cube": 5.72,
                "Scalar": 47.06,
                "Fixpipe": 14.95
              }
            }
          }
        ]
      },
      {
        "name": "_hc_combine_norm_kernel",
        "points": [
          {
            "batch": 1,
            "calls": 840,
            "total_us": 5553.241,
            "mean_us": 6.611,
            "p50_us": 6.66,
            "p95_us": 7.56,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 840,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 15.51,
                "MTE3": 6.0,
                "Vector": 15.68,
                "Cube": 0.0,
                "Scalar": 11.86,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 840,
            "total_us": 10816.134,
            "mean_us": 12.87635,
            "p50_us": 13.2,
            "p95_us": 14.16,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 840,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 22.68,
                "MTE3": 10.38,
                "Vector": 14.89,
                "Cube": 0.0,
                "Scalar": 10.3,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 840,
            "total_us": 13354.689,
            "mean_us": 15.89844,
            "p50_us": 16.28,
            "p95_us": 16.86,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 840,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 24.07,
                "MTE3": 12.17,
                "Vector": 23.46,
                "Cube": 0.0,
                "Scalar": 13.28,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      },
      {
        "name": "hcom_allGather_",
        "points": [
          {
            "batch": 1,
            "calls": 1104,
            "total_us": 7134.03,
            "mean_us": 6.46198,
            "p50_us": 5.94,
            "p95_us": 9.0,
            "core": "COMMUNICATION",
            "pipeline": {
              "coverage": 50.0,
              "measured_calls": 552,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 26.06,
                "MTE3": 5.27,
                "Vector": 0.34,
                "Cube": 0.0,
                "Scalar": 28.37,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 1096,
            "total_us": 10539.096,
            "mean_us": 9.61596,
            "p50_us": 6.4,
            "p95_us": 20.021,
            "core": "COMMUNICATION",
            "pipeline": {
              "coverage": 38.45,
              "measured_calls": 544,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 30.04,
                "MTE3": 5.69,
                "Vector": 0.29,
                "Cube": 0.0,
                "Scalar": 26.78,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 1096,
            "total_us": 12795.575,
            "mean_us": 11.67479,
            "p50_us": 7.36,
            "p95_us": 33.421,
            "core": "COMMUNICATION",
            "pipeline": {
              "coverage": 39.38,
              "measured_calls": 544,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 36.17,
                "MTE3": 7.06,
                "Vector": 0.23,
                "Cube": 0.0,
                "Scalar": 21.81,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      },
      {
        "name": "RecurrentGatedDeltaRule",
        "points": [
          {
            "batch": 1,
            "calls": 288,
            "total_us": 8613.568,
            "mean_us": 29.90822,
            "p50_us": 29.5705,
            "p95_us": 31.36,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 288,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 5.97,
                "MTE3": 14.29,
                "Vector": 73.69,
                "Cube": 0.0,
                "Scalar": 33.93,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 288,
            "total_us": 10046.625,
            "mean_us": 34.88411,
            "p50_us": 34.64,
            "p95_us": 36.341,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 288,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 7.4,
                "MTE3": 12.05,
                "Vector": 63.17,
                "Cube": 0.0,
                "Scalar": 31.72,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 288,
            "total_us": 12247.452,
            "mean_us": 42.52587,
            "p50_us": 42.121,
            "p95_us": 46.061,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 288,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 9.82,
                "MTE3": 10.45,
                "Vector": 51.82,
                "Cube": 0.0,
                "Scalar": 29.03,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      },
      {
        "name": "Mul",
        "points": [
          {
            "batch": 1,
            "calls": 1848,
            "total_us": 8716.019,
            "mean_us": 4.71646,
            "p50_us": 2.42,
            "p95_us": 14.78,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 1848,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 9.17,
                "MTE3": 3.4,
                "Vector": 2.62,
                "Cube": 0.0,
                "Scalar": 12.11,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 1848,
            "total_us": 11133.305,
            "mean_us": 6.02452,
            "p50_us": 4.6505,
            "p95_us": 16.44,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 1848,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 6.71,
                "MTE3": 2.86,
                "Vector": 1.97,
                "Cube": 0.0,
                "Scalar": 15.83,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 1848,
            "total_us": 11609.501,
            "mean_us": 6.2822,
            "p50_us": 4.89,
            "p95_us": 16.041,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 1848,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 6.46,
                "MTE3": 3.17,
                "Vector": 2.02,
                "Cube": 0.0,
                "Scalar": 15.87,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      },
      {
        "name": "_hc_gate_mix_kernel",
        "points": [
          {
            "batch": 1,
            "calls": 896,
            "total_us": 5587.836,
            "mean_us": 6.23642,
            "p50_us": 6.64,
            "p95_us": 7.44,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 896,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 18.83,
                "MTE3": 2.42,
                "Vector": 9.52,
                "Cube": 0.0,
                "Scalar": 11.94,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 896,
            "total_us": 8644.575,
            "mean_us": 9.64796,
            "p50_us": 9.941,
            "p95_us": 11.18,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 896,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 26.5,
                "MTE3": 3.81,
                "Vector": 13.83,
                "Cube": 0.0,
                "Scalar": 12.05,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 896,
            "total_us": 10510.96,
            "mean_us": 11.73098,
            "p50_us": 11.86,
            "p95_us": 12.64,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 896,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 31.55,
                "MTE3": 5.78,
                "Vector": 21.88,
                "Cube": 0.0,
                "Scalar": 15.22,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      },
      {
        "name": "MoeDistributeCombineV2",
        "points": [
          {
            "batch": 1,
            "calls": 424,
            "total_us": 6513.205,
            "mean_us": 15.36133,
            "p50_us": 14.98,
            "p95_us": 18.46,
            "core": "MIX_AIV",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 424,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 11.01,
                "MTE3": 2.71,
                "Vector": 0.97,
                "Cube": 0.0,
                "Scalar": 17.82,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 424,
            "total_us": 6487.11,
            "mean_us": 15.29979,
            "p50_us": 15.221,
            "p95_us": 16.96,
            "core": "MIX_AIV",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 424,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 7.35,
                "MTE3": 7.01,
                "Vector": 1.4,
                "Cube": 0.0,
                "Scalar": 17.05,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 424,
            "total_us": 7187.53,
            "mean_us": 16.95172,
            "p50_us": 16.2905,
            "p95_us": 19.761,
            "core": "MIX_AIV",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 424,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 8.39,
                "MTE3": 9.58,
                "Vector": 1.82,
                "Cube": 0.0,
                "Scalar": 17.37,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      },
      {
        "name": "MatMulV3",
        "points": [
          {
            "batch": 1,
            "calls": 424,
            "total_us": 5658.78,
            "mean_us": 13.34618,
            "p50_us": 13.241,
            "p95_us": 14.82,
            "core": "AI_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 424,
              "scores": {
                "MTE1": 4.9,
                "MTE2": 12.74,
                "MTE3": 0.0,
                "Vector": 0.0,
                "Cube": 2.25,
                "Scalar": 40.27,
                "Fixpipe": 2.56
              }
            }
          },
          {
            "batch": 4,
            "calls": 424,
            "total_us": 5952.577,
            "mean_us": 14.0391,
            "p50_us": 13.9205,
            "p95_us": 15.501,
            "core": "AI_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 424,
              "scores": {
                "MTE1": 5.49,
                "MTE2": 14.37,
                "MTE3": 0.0,
                "Vector": 0.0,
                "Cube": 3.11,
                "Scalar": 38.58,
                "Fixpipe": 3.03
              }
            }
          },
          {
            "batch": 8,
            "calls": 424,
            "total_us": 5938.925,
            "mean_us": 14.0069,
            "p50_us": 13.88,
            "p95_us": 15.581,
            "core": "AI_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 424,
              "scores": {
                "MTE1": 7.05,
                "MTE2": 17.55,
                "MTE3": 0.0,
                "Vector": 0.0,
                "Cube": 3.63,
                "Scalar": 38.22,
                "Fixpipe": 7.61
              }
            }
          }
        ]
      },
      {
        "name": "fused_gdn_gating_kernel",
        "points": [
          {
            "batch": 1,
            "calls": 288,
            "total_us": 3508.414,
            "mean_us": 12.18199,
            "p50_us": 12.02,
            "p95_us": 13.06,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 288,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 4.28,
                "MTE3": 0.38,
                "Vector": 10.17,
                "Cube": 0.0,
                "Scalar": 6.88,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 4,
            "calls": 288,
            "total_us": 3518.427,
            "mean_us": 12.21676,
            "p50_us": 12.001,
            "p95_us": 13.421,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 288,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 5.18,
                "MTE3": 0.35,
                "Vector": 10.16,
                "Cube": 0.0,
                "Scalar": 6.79,
                "Fixpipe": 0.0
              }
            }
          },
          {
            "batch": 8,
            "calls": 288,
            "total_us": 3525.031,
            "mean_us": 12.23969,
            "p50_us": 12.0,
            "p95_us": 13.46,
            "core": "AI_VECTOR_CORE",
            "pipeline": {
              "coverage": 100.0,
              "measured_calls": 288,
              "scores": {
                "MTE1": 0.0,
                "MTE2": 5.31,
                "MTE3": 0.54,
                "Vector": 10.12,
                "Cube": 0.0,
                "Scalar": 7.32,
                "Fixpipe": 0.0
              }
            }
          }
        ]
      }
    ],
    "verified": [
      {
        "batch": 1,
        "submitted_batch": 1,
        "kernel_csv": "profiles/Batch1_Qwen4Exp_dp0_pp0_tp0_dcp0_ep0_rank0_256_20261125031658504_ascend_pt/ASCEND_PROFILER_OUTPUT/kernel_details.csv",
        "observed": {
          "1": 8
        },
        "steps": 8,
        "kernel_calls": 38223
      },
      {
        "batch": 4,
        "submitted_batch": 4,
        "kernel_csv": "profiles/Batch1_Qwen4Exp_dp0_pp0_tp0_dcp0_ep0_rank0_256_20261125031743639_ascend_pt/ASCEND_PROFILER_OUTPUT/kernel_details.csv",
        "observed": {
          "4": 8
        },
        "steps": 8,
        "kernel_calls": 39183
      },
      {
        "batch": 8,
        "submitted_batch": 8,
        "kernel_csv": "profiles/Batch1_Qwen4Exp_dp0_pp0_tp0_dcp0_ep0_rank0_256_20261125031806824_ascend_pt/ASCEND_PROFILER_OUTPUT/kernel_details.csv",
        "observed": {
          "8": 8
        },
        "steps": 8,
        "kernel_calls": 39087
      }
    ],
    "failures": {},
    "sort_batch": 8,
    "mtp": 5,
    "kernelContext": "950DT TP4/EP4 与 A3 TP8/EP8 · MTP5",
    "tested": "2026-11-25",
    "context": "W8A8 · DP1 · MTP5 · 128K 热前缀 → 96 tokens · A3 TP8/EP8 · 950DT TP4/EP4",
    "runtime": {
      "a3": {
        "driver": "26.1.0",
        "cann": "9.3.0",
        "ep": 8,
        "tp": 8,
        "vllm": "0.33.0"
      },
      "950dt": {
        "cann": "9.2.1",
        "ep": 4,
        "tp": 4,
        "vllm": "0.30.0"
      }
    },
    "note": "A3 使用 vLLM 0.33.0 / CANN 9.3.0，950DT 使用 vLLM 0.30.0 / CANN 9.2.1。两边的前缀命中率均为 99.61%。A3 图表采用关闭 profiler 的复测轮。首次 B4 的 TPOT 为 140.30 ms，复测为 77.59 ms，两轮数据均可下载。结果反映各自部署配置的性能。",
    "baselinePrefixCache": {
      "4": {
        "prefix_cache_queries": 524288,
        "prefix_cache_hits": 522240
      },
      "8": {
        "prefix_cache_queries": 1048576,
        "prefix_cache_hits": 1044480
      },
      "1": {
        "prefix_cache_queries": 131072,
        "prefix_cache_hits": 130560
      }
    },
    "kernelNote": "在下方「对照工况」选择 950DT / A3，即可按实际 Batch 对照 rank 0 的算子曲线和流水线读数。三档各保留 8 个 Decode 步。MoE 的 V2 / V3 等不同 Profiling Type 分别显示，某端未采集的档位留空。",
    "firstPassPerf": [
      {
        "batch": 1,
        "input_tokens_per_request": 131072,
        "output_tokens_per_request": 96,
        "ttft_mean_ms": 817.8139,
        "tpot_mean_ms": 80.63969,
        "decoded_tokens_per_s": 12.40084,
        "itl_mean_ms": 368.81205,
        "itl_samples": 21,
        "drafted": 105,
        "accepted": 78,
        "acceptance_rate": 0.74286,
        "prefix_cache_queries": 131072,
        "prefix_cache_hits": 130560
      },
      {
        "batch": 4,
        "input_tokens_per_request": 131072,
        "output_tokens_per_request": 96,
        "ttft_mean_ms": 18726.12542,
        "tpot_mean_ms": 140.30118,
        "decoded_tokens_per_s": 11.77266,
        "itl_mean_ms": 652.72872,
        "itl_samples": 83,
        "drafted": 415,
        "accepted": 302,
        "acceptance_rate": 0.72771,
        "prefix_cache_queries": 524288,
        "prefix_cache_hits": 522240
      },
      {
        "batch": 8,
        "input_tokens_per_request": 131072,
        "output_tokens_per_request": 96,
        "ttft_mean_ms": 2003.59658,
        "tpot_mean_ms": 80.13351,
        "decoded_tokens_per_s": 80.39524,
        "itl_mean_ms": 388.53848,
        "itl_samples": 164,
        "drafted": 820,
        "accepted": 622,
        "acceptance_rate": 0.75854,
        "prefix_cache_queries": 1048576,
        "prefix_cache_hits": 1044480
      }
    ]
  }
};
