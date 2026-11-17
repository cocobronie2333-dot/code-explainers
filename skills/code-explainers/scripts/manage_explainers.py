"""Register source-grounded HTML explainers and publish the dedicated Pages site."""
import argparse
from datetime import datetime, timedelta, timezone
import html
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import time
import urllib.request

REPO = "cocobronie2333-dot/code-explainers"
SITE = "https://cocobronie2333-dot.github.io/code-explainers/"


def run(args, root):
    result = subprocess.run(args, cwd=root, capture_output=True, text=True, encoding="utf-8")
    if result.returncode:
        raise RuntimeError((result.stderr or result.stdout).strip())
    return result.stdout.strip()


def gh(args, root):
    binary = shutil.which("gh")
    if not binary:
        raise RuntimeError("GitHub CLI gh is required")
    return run([binary, *args], root)


def clean_checkout(root):
    origin = run(["git", "remote", "get-url", "origin"], root)
    origin = origin.removesuffix(".git").replace("git@github.com:", "https://github.com/")
    if origin != "https://github.com/" + REPO:
        raise RuntimeError("origin does not match the authorized repository")
    if run(["git", "branch", "--show-current"], root) != "main":
        raise RuntimeError("Publish from main in the dedicated repository")
    if run(["git", "status", "--porcelain"], root):
        raise RuntimeError("Checkout has changes; preserve them and stage explicitly after verification")
    run(["git", "fetch", "origin", "main"], root)
    ahead, _ = map(int, run(["git", "rev-list", "--left-right", "--count", "HEAD...origin/main"], root).split())
    if ahead:
        raise RuntimeError("Inspect unpublished local commits before publishing")
    run(["git", "merge", "--ff-only", "origin/main"], root)


def portable(content):
    if not re.search(r"<!doctype\s+html", content, re.I):
        raise ValueError("A standalone HTML document is required")
    match = re.search(r"const SOURCES = (.*);\nconst NAMES", content)
    if match:
        sources = json.loads(match.group(1))
        for source in sources.values():
            source["local"] = source["path"] + ":" + str(source["line"])
        content = content[:match.start(1)] + json.dumps(sources, ensure_ascii=False).replace("</", "<\\/") + content[match.end(1):]
    content = content.replace("本地代码摘录", "固定版本代码摘录")
    if "data-explainer-home" not in content:
        nav = '<nav data-explainer-home style="max-width:1320px;margin:16px auto 0;padding:0 36px;font:13px/1.6 system-ui"><a href="../" style="color:inherit">← 代码讲解目录</a></nav>'
        content = re.sub(r"(<body\b[^>]*>)", lambda m: m.group(1) + "\n" + nav, content, count=1, flags=re.I)
    return content


def homepage(catalog):
    cards = []
    for item in sorted(catalog["items"], key=lambda item: item["updated"], reverse=True):
        title, summary = html.escape(item["title"]), html.escape(item["summary"])
        tags = "".join("<span>" + html.escape(tag) + "</span>" for tag in item["tags"])
        search = html.escape(" ".join([item["title"], item["summary"], *item["tags"]]).lower(), quote=True)
        cards.append(f'<article data-search="{search}"><div class="item-meta"><time>{html.escape(item["updated"])}</time><div class="tags">{tags}</div></div><h2><a href="{item["slug"]}/">{title} ↗</a></h2><p>{summary}</p><a class="read" href="{item["slug"]}/">打开交互讲解 →</a></article>')
    template = (Path(__file__).resolve().parents[1] / "assets/catalog-template.html").read_text(encoding="utf-8")
    return template.replace("__CARDS__", "\n".join(cards))


def add(args):
    root = Path(args.repo_dir).resolve()
    if args.publish:
        clean_checkout(root)
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", args.slug):
        raise ValueError("slug must be lowercase ASCII words separated by hyphens")
    if args.slug in {"assets", "scripts", "skills"}:
        raise ValueError("Reserved slug")
    content = portable(Path(args.html).read_text(encoding="utf-8"))
    root.mkdir(parents=True, exist_ok=True)
    path = root / "catalog.json"
    catalog = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {"version": 1, "items": []}
    if catalog.get("version") != 1:
        raise ValueError("Unsupported catalog schema")
    old = next((item for item in catalog["items"] if item["slug"] == args.slug), {})
    revisions = dict(old.get("source_revisions", {}))
    for spec in args.source_revision:
        name, revision = spec.split("=", 1)
        revisions[name] = revision
    updated = args.updated or datetime.now(timezone(timedelta(hours=8))).date().isoformat()
    entry = dict(slug=args.slug, title=args.title, summary=args.summary, tags=[tag.strip() for tag in args.tags.split(",") if tag.strip()], updated=updated, source_revisions=revisions)
    catalog["items"] = [item for item in catalog["items"] if item["slug"] != args.slug] + [entry]
    destination = root / args.slug / "index.html"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(content, encoding="utf-8")
    path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (root / "index.html").write_text(homepage(catalog), encoding="utf-8")
    print(json.dumps({"registered": args.slug, "url": SITE + args.slug + "/"}), flush=True)
    if args.publish:
        run(["git", "add", "--", args.slug + "/index.html", "catalog.json", "index.html"], root)
        if run(["git", "diff", "--cached", "--name-only"], root):
            run(["git", "commit", "-s", "-m", "docs: update " + args.slug + " explainer"], root)
            run(["git", "push", "origin", "main"], root)
        verify(root, args.slug)


def verify(root, slug):
    commit = run(["git", "rev-parse", "HEAD"], root)
    previous = None
    for _ in range(60):
        status = json.loads(gh(["api", "repos/" + REPO + "/pages/builds/latest"], root))
        current = (status.get("status"), status.get("commit"))
        if current != previous:
            print(json.dumps({"pages_status": current[0], "commit": current[1]}), flush=True)
            previous = current
        if current[1] == commit and current[0] == "built":
            break
        if current[1] == commit and current[0] == "errored":
            raise RuntimeError("Pages failed: " + str(status.get("error")))
        time.sleep(10)
    else:
        raise RuntimeError("Pages remains unverified after ten minutes; inspect the existing build")
    catalog = json.loads((root / "catalog.json").read_text(encoding="utf-8"))
    item = next(item for item in catalog["items"] if item["slug"] == slug)
    for suffix, marker in [("", "代码讲解集"), (slug + "/", item["title"])]:
        url = SITE + suffix
        error = None
        for _ in range(12):
            try:
                with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "code-explainers-deploy"}), timeout=30) as response:
                    body = response.read().decode("utf-8")
                    if response.status == 200 and (marker in body or html.escape(marker) in body):
                        print(json.dumps({"verified": url}), flush=True)
                        break
                    raise RuntimeError("Unexpected page content")
            except (OSError, RuntimeError) as exc:
                error = exc
                time.sleep(10)
        else:
            raise RuntimeError(f"HTTP verification failed: {url}: {error}")


def main():
    parser = argparse.ArgumentParser()
    commands = parser.add_subparsers(dest="command", required=True)
    register = commands.add_parser("add")
    for name in ["repo-dir", "html", "slug", "title", "summary"]:
        register.add_argument("--" + name, required=True)
    register.add_argument("--tags", default="")
    register.add_argument("--updated")
    register.add_argument("--source-revision", action="append", default=[])
    register.add_argument("--publish", action="store_true")
    check = commands.add_parser("verify")
    check.add_argument("--repo-dir", required=True)
    check.add_argument("--slug", required=True)
    args = parser.parse_args()
    if args.command == "add":
        add(args)
    else:
        verify(Path(args.repo_dir).resolve(), args.slug)


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, ValueError, OSError) as exc:
        print("ERROR: " + str(exc), file=sys.stderr)
        sys.exit(1)
