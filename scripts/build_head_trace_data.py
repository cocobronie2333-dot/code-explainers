"""Extract measured host/device intervals for the Chunk Observatory head tab.

Raw traces stay outside the website. This retains every complete Ascend
Hardware and Overlap Analysis interval, lw markers, selected CPU operators,
and CANN memcpy/event-wait calls. Flow arrows/counters are not reconstructed.
"""
import argparse
from collections import Counter
from decimal import Decimal
import hashlib
import json
from pathlib import Path
import re

HOTOPS = {
    "aclnnLightningIndexer", "aclnnGenericBlockSparseAttention",
    "vllm::moe_forward_shared", "vllm::qwen_gdn_attention_core",
    "vllm::qwen4_exp_qsa_prepare_with_output", "vllm::unquantized_gemm",
    "vllm::all_reduce", "fla_npu_stable::npu_chunk_gated_delta_rule_fwd",
}
COPY_APIS = {"AscendCL@aclrtMemcpy", "AscendCL@aclrtMemcpyAsync",
             "AscendCL@aclrtSynchronizeEvent", "AscendCL@aclrtSynchronizeStream"}
KINDS = ["host", "copy_api", "compute", "copy", "sync", "device",
         "comm", "comm_uncovered", "idle", "hotop"]


def extract(path):
    raw = path.read_bytes()
    source = json.loads(raw)
    events = source if isinstance(source, list) else source["traceEvents"]
    processes = {str(e["pid"]): e["args"]["name"] for e in events
                 if e.get("ph") == "M" and e.get("name") == "process_name"}
    threads = {(str(e["pid"]), str(e["tid"])): e["args"]["name"] for e in events
               if e.get("ph") == "M" and e.get("name") == "thread_name"}
    steps = sorted((e for e in events if e.get("ph") == "X" and
                    re.fullmatch(r"lw/execute_model/step\d+/layer-1", e.get("name", ""))),
                   key=lambda e: Decimal(str(e["ts"])))
    if not steps:
        raise ValueError(f"No measured execute_model intervals in {path.name}")
    origin = Decimal(str(steps[0]["ts"]))
    names, tracks, records, details = [], [], [], []
    name_ids, track_ids = {}, {}

    def name_id(name):
        if name not in name_ids:
            name_ids[name] = len(names)
            names.append(name)
        return name_ids[name]

    def ns(value):
        return int(round(Decimal(str(value)) * 1000))

    def offset(value):
        return int(round((Decimal(str(value)) - origin) * 1000))

    for index, e in enumerate(events):
        if e.get("ph") != "X" or float(e.get("dur", 0)) <= 0:
            continue
        name, pid, tid = e.get("name", ""), str(e["pid"]), str(e["tid"])
        process, args = processes.get(pid, "Unknown"), e.get("args", {})
        if process == "Ascend Hardware":
            task = args.get("Task Type", "")
            kind = ("copy" if name == "MEMCPY_ASYNC" else "compute" if
                    task in {"AI_CORE", "AI_VECTOR_CORE", "MIX_AIC", "MIX_AIV", "AI_CPU"}
                    else "sync" if any(t in name.upper() for t in ("WAIT", "RECORD")) else "device")
        elif process == "Overlap Analysis":
            kind = {"Computing": "compute", "Communication": "comm",
                    "Communication(Not Overlapped)": "comm_uncovered", "Free": "idle"}.get(name)
            if not kind:
                continue
        elif e.get("cat") == "cpu_op" and name.startswith("lw/"):
            kind = "host"
        elif e.get("cat") == "cpu_op" and name in HOTOPS:
            kind = "hotop"
        elif process == "CANN" and name in COPY_APIS:
            kind = "copy_api"
        else:
            continue
        key = (pid, tid)
        if key not in track_ids:
            track_ids[key] = len(tracks)
            tracks.append({"pid": pid, "tid": tid, "process": process,
                           "name": threads.get(key, "Thread " + tid)})
        marker = re.fullmatch(r"lw/(.+)/step(\d+)/layer(-?\d+)", name)
        layer, step = (int(marker[3]), int(marker[2])) if marker else (-1, 0)
        detail = -1
        if kind in {"copy", "copy_api"}:
            detail = len(details)
            details.append({k: args[k] for k in ("Task Type", "Task Id", "Physic Stream Id",
                           "connection_id", "Thread Id", "id") if k in args})
        records.append([name_id(name), track_ids[key], offset(e["ts"]), ns(e["dur"]),
                        KINDS.index(kind), layer, step, index, detail])
    records.sort(key=lambda e: (e[2], e[3], e[7]))
    complete = [e for e in events if e.get("ph") == "X" and float(e.get("dur", 0)) > 0]
    return {"file": path.name, "sha256": hashlib.sha256(raw).hexdigest(),
            "source_path": "/".join(path.parts[-4:]), "original_events": len(events),
            "origin_us": str(origin), "time_unit": "ns", "names": names, "tracks": tracks,
            "events": records, "details": details,
            "steps": [{"step": int(re.search(r"/step(\d+)/", e["name"])[1]),
                       "start": offset(e["ts"]), "duration": ns(e["dur"])} for e in steps],
            "bounds": [min(offset(e["ts"]) for e in complete),
                       max(offset(e["ts"]) + ns(e["dur"]) for e in complete)],
            "retained_by_kind": dict(Counter(KINDS[e[4]] for e in records)),
            "device_memcpy_direction": "Not provided by these traces; do not infer load/save from stream IDs"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--b48", type=Path, required=True)
    parser.add_argument("--b2", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--html", type=Path, help="Also replace the embedded head dataset in an existing Observatory page")
    args = parser.parse_args()
    data = {"schema": 1, "capture": "20261116_106_dram40", "kinds": KINDS,
            "record_fields": ["name", "track", "start_ns", "duration_ns", "kind", "layer",
                              "step_marker", "source_event_index", "detail"],
            "rounding": "Decimal timestamps relative to first execute_model; nearest nanosecond",
            "b48": extract(args.b48), "b2": extract(args.b2)}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    encoded = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    args.out.write_text(encoded, encoding="utf-8")
    if args.html:
        page = args.html.read_text(encoding="utf-8")
        pattern = r'(<script id="head-trace-dataset" type="application/json">)[\s\S]*?(</script>)'
        if len(re.findall(pattern, page)) != 1:
            raise ValueError("Expected exactly one existing embedded head dataset")
        page = re.sub(pattern, lambda m: m[1] + encoded + m[2], page, count=1)
        args.html.write_text(page, encoding="utf-8", newline="\n")
    print(json.dumps({tag: {"retained": len(data[tag]["events"]), "steps": data[tag]["steps"],
                           "kinds": data[tag]["retained_by_kind"]} for tag in ("b48", "b2")}))


if __name__ == "__main__":
    main()
