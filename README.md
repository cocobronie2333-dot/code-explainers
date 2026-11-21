# Code Explainers · 代码讲解与性能优化

集中管理两类交互式 HTML：代码讲解用于理解源码中的特性、调用链和数据流；性能优化用于探索 profiling 数据、执行瓶颈与方案对比。

- [目录首页](https://cocobronie2333-dot.github.io/code-explainers/)
- [KV Cache 池化与 P/D 分离：Memcache / Mooncake](https://cocobronie2333-dot.github.io/code-explainers/kv-cache-pooling/)
- [Chunk Observatory · 128K / TP8](https://cocobronie2333-dot.github.io/code-explainers/chunk-observatory/)：性能优化，比较 48buffer 与 2-buffer 的 chunk 执行、等待和搬运。
- [rank0 算子增长与通信定位](https://cocobronie2333-dot.github.io/code-explainers/rank0-operator-growth/)：A3 b48 / b2 / b4 的通信等待、算子变化与 load/save 依赖，含对照图和 15 项配套附件。
- [Qwen4Exp · A3/A5 单请求 Profiling 对比](https://cocobronie2333-dot.github.io/code-explainers/qwen4-a3-a5-profiling/)：阶段耗时、通信、host 准备及 GDN 间隙，含 6 张原报告图表与 PNG 下载。

这两份报告保留所提供 HTML 的正文、数据表和分析口径。rank0 报告的原有附件已补齐，下载区另提供逐周期统计、b48 / b4 通信事件和运行时代码；约 167 MiB 的完整 `analysis.json` 以约 9.3 MiB 的 gzip 无损压缩包提供，解压后得到原始 JSON。A3/A5 报告也恢复了 A3 逐通信事件的下载入口；其余尚未提供的证据文件继续标记“附件未提供”。各页的 `publication.json` 记录原文件 SHA-256、附件校验值和可用范围。

首页提供“全部 / 代码讲解 / 性能优化”筛选、分类分区与统一搜索。外部代码讲解参考单独展示，不计入本站 HTML 数量。筛选与搜索可通过 URL 保留，例如 [仅查看性能优化](https://cocobronie2333-dot.github.io/code-explainers/?category=performance)。

首页和各主题页面统一使用根目录的 `favicon.svg` 作为标签页图标；登记脚本会为新增或更新的 HTML 自动设置同一图标。

`catalog.json` 的每个页面使用 `category: "code"` 或 `category: "performance"`；旧条目缺省为 `code`。性能页保留原始数据与计时说明，不要求附带代码讲解的源码版本。Chunk Observatory 内嵌全部数据，可离线打开；CPU 调用耗时、轻量采集与完整 profiling 的比较范围见页面中的统计规则。

Chunk Observatory 的执行时间轴支持两组独立采集：原来的 86-chunk 数据，以及 [2026-11-16 head trace 对照](https://cocobronie2333-dot.github.io/code-explainers/chunk-observatory/?capture=head)。新采集包含 `b48-head.trace.json` 与 `b2-head.trace.json` 的 Step 1–4，可查看主机标记、Computing、通信和实际设备 stream；两组时间轴可独立折叠，共享缩放、数值视窗与悬停竖线。点击任意泳道名称可切换整行边框高亮，支持两组分别多选；高亮在缩放、切换 step 和折叠后保留，也支持键盘 Enter / 空格。点击“放大一段 COPY 重叠”可直接进入实际的计算 / 拷贝交集窗口。

每组标题旁的重置图标可清除本组泳道高亮与块聚焦，并恢复两组共用的时间缩放。原始采集再次点击同一层块会恢复点击前的层筛选和时间窗；head trace 点击块后只显示同泳道的该块，再点同一块恢复其它块。head 的块聚焦仅影响显示，统计仍基于完整视窗。

两次运行只按各自 step 起点对齐；同一 trace 内不移动单条轨道。Step 视图按各组自己的边界裁剪，不混入下一 step；完整 head 保留间隙与设备尾部。重叠时长按区间并集的交集计算，不相加嵌套事件；这些设备 `MEMCPY_ASYNC` 未提供拷贝方向，不能直接全部标为池化 Load / Save。采集切换时，旧数据的统计与控制会收起，避免混用采集来源。

新采集保留 219,438 个实测区间，包括全部正时长 Ascend Hardware / Overlap Analysis 事件、主机 lw 标记、选定 CPU 热点及 CANN memcpy / 等待调用；不嵌入原始约 100 MB 的 trace 文件，不重建未保留的 flow / counter。每份原始数据的 SHA256、源事件索引与提取规则可在页面核对。原有 86-chunk 内嵌数据保持不变。

可用 [提取脚本](scripts/build_head_trace_data.py) 从同一对原始文件重建这次采集的内嵌数据（页面布局与交互不变）：

```powershell
python scripts/build_head_trace_data.py --b48 <b48-head.trace.json> --b2 <b2-head.trace.json> --out <temporary-directory>/head-data.json --html chunk-observatory/index.html
```

当前 KV Cache 讲解支持独立开启 / 关闭共享池与 PD 分离，PD 可选择 V2 Pull、V1 Pull、经典逐层 Push、实验性 V2 Push 和 D2RH。池化位置可选 P、D 或两端，D 的读写权限与外部来源顺序独立配置；D 端 DRAM staging 与共享池分别标注。每种路径保留事件、元数据、配置片段与固定版本源码入口。

默认只展开 PD、共享池与池化位置，传输方案、D 读写权限和示例输入收纳在“详细配置”。吸顶摘要显示实际生效值。桌面时间线与事件详情并排，支持“处理与接口 / 元数据 / HBM·DRAM”切换；事件标签默认保持可读宽度，也可切到带事件编号的全图概览。泳道与详情各自滚动，源码阅读、分享链接和离线使用保持联动。窄屏自动改为上下布局。

## 池化位置与 D 端来源选择

- PD 与池化均开启后，才可选择 P / D / 两端；位置包含 D 时，才启用 `consumer_is_to_load` 与 `consumer_is_to_put`。D 可仅读、仅写或读写同时开启。
- D 池读取开启后，才启用“池优先 / PD 优先”和池命中预设。顺序对应 D `MultiConnector` 的 `connectors` 数组，不是 `enable_prefix_caching`；本页本地前缀缓存固定开启。
- 普通来源选择记录第一个正命中，继续查询后续子项，任何后续 `None` 仍令本轮等待；不取最大、不相加，也不顺次拼接两份外部前缀。池部分命中胜出时，剩余后缀由 D 计算。
- 禁用项保留偏好，生成 JSON 与时间线使用生效值。整块异步读只在允许池读取时启用；逐层实际 `load_async=False`。

页面同时展示 Ascend 分派与上游的区别：未选中子项通常收到空块表 / 0，observer 标志是例外。经典逐层 Push observer、非选中逐层 Store 的 `can_load` 保留，以及 P Store 与 V2 Push 的源块传递，均保留当前固定快照的源码核验点；页面不会把这些组合直接画成已验证成功。D2RH 即使最终未被选中，也可能已经在查询阶段启动第一跳 staging。

## 组织方式

```text
index.html                 可搜索的目录首页
catalog.json               页面分类、主题信息、源码版本与外部参考
kv-cache-pooling/index.html 当前池化讲解
chunk-observatory/index.html chunk 性能分析
skills/code-explainers/     配套 Codex skill、发布脚本与目录模板
<new-topic>/index.html      后续独立主题
```

每篇讲解尽量保持单文件、离线可读，并使用固定 commit 的源码链接。图中的事件宽度、地址和数据规模若为教学假设，会在页面中说明。

## 新增和更新

仅在明确要求生成或更新 HTML / 交互式讲解网页时使用个人 Codex skill `$code-explainers`：读取源码、制作 HTML、登记 `catalog.json`、同步重建首页，再提交发布。普通代码解释、调用链问答不会触发，也不会默认生成或发布网页。可以指定仅本地生成。

手动维护时，为主题创建独立目录，将最终文档放为 `index.html`，并更新目录及首页。不要提交截图、聊天附件、依赖目录或本地凭据。

登记用户明确要求发布的性能 HTML 时，给现有目录脚本添加 `--category performance`；代码讲解使用 `--category code`。更新已有页面而未指定分类时，脚本保留其原分类。登记后重建首页会保留两个分区：

```powershell
python skills/code-explainers/scripts/manage_explainers.py add --repo-dir . --html <path-to-html> --slug <page-slug> --category performance --title <page-title> --summary <page-summary> --tags Profiling
```

GitHub Pages 从 `main` 分支根目录发布；推送后自动构建。`.nojekyll` 保留纯静态 HTML，不依赖 Jekyll。

## 配套 skill

完整源码见 [skills/code-explainers](skills/code-explainers)，使用说明见 [SKILL.md](skills/code-explainers/SKILL.md)。目录包含界面配置、主题登记 / 发布脚本，以及首页模板。

在已安装 Codex 和 Python 的机器上，运行以下命令从 GitHub 安装：

```powershell
python "$HOME/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py" --repo cocobronie2333-dot/code-explainers --path skills/code-explainers
```

安装完成后，在下一轮对话中使用 `$code-explainers`。

也可以手动将整个 `skills/code-explainers` 目录复制到个人 skills 目录，保留 `agents/`、`assets/`、`references/` 和 `scripts/` 的相对结构。通常目标为 `~/.codex/skills/code-explainers`；Windows 下为 `%USERPROFILE%\.codex\skills\code-explainers`。

这个 skill 默认面向本仓库和对应 Pages 站点。用于其它账号时，需同步调整说明和脚本中的目标仓库与站点地址。

## 参考模板

首页单独收录原文入口，保留作者与完整定位链接：

- [bowgneo · vLLM KV Connector 调度流程](https://bowgneo.github.io/posts/vllm-kv-connector-scheduling-flow/)：学习阶段拆分、请求实例、线程与同步关系。
- [biuapha · GLM-5.3-Flash 算子与 KV cache 分析](https://biuapha.github.io/LLM-Analysis/glm53_prefill_decode_operator_block_diagram.html?v=dede271#prompt-links)：学习总览下钻、tensor 详情、容量口径与来源索引。

可复用的方法与适用范围见 [skill 参考说明](skills/code-explainers/references/templates.md)。参考以外链形式管理，原文内容归原作者；生成新讲解时重新核对目标源码和版本。

维护 `catalog.json` 的 `references` 后，用以下命令重建首页；后续登记新主题也会保留这些参考：

```powershell
python skills/code-explainers/scripts/manage_explainers.py rebuild --repo-dir .
```

## 代码来源

当前主题基于以下固定版本：

- [vLLM · 24420b7a34](https://github.com/vllm-project/vllm/tree/24420b7a341af37a9bc3186e6fc6062512e0aa58)
- [vLLM Ascend · 76ea9d24f1](https://github.com/vllm-project/vllm-ascend/tree/76ea9d24f155afe032ad9ac6c98717f1f7334f36)

各页面内包含具体文件、行号和摘录链接。来源及许可证见 [NOTICE](NOTICE) 和 [LICENSE](LICENSE)。
