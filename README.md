# Code Explainers · 代码讲解与性能优化

集中管理两类交互式 HTML：代码讲解用于理解源码中的特性、调用链和数据流；性能优化用于探索 profiling 数据、执行瓶颈与方案对比。

- [目录首页](https://cocobronie2333-dot.github.io/code-explainers/)
- [KV Cache 池化与 P/D 分离：Memcache / Mooncake](https://cocobronie2333-dot.github.io/code-explainers/kv-cache-pooling/)
- [Chunk Observatory · 128K / TP8](https://cocobronie2333-dot.github.io/code-explainers/chunk-observatory/)：性能优化，比较 48buffer 与 2-buffer 的 chunk 执行、等待和搬运。

首页提供“全部 / 代码讲解 / 性能优化”筛选、分类分区与统一搜索。外部代码讲解参考单独展示，不计入本站 HTML 数量。筛选与搜索可通过 URL 保留，例如 [仅查看性能优化](https://cocobronie2333-dot.github.io/code-explainers/?category=performance)。

`catalog.json` 的每个页面使用 `category: "code"` 或 `category: "performance"`；旧条目缺省为 `code`。性能页保留原始数据与计时说明，不要求附带代码讲解的源码版本。Chunk Observatory 内嵌全部数据，可离线打开；CPU 调用耗时、轻量采集与完整 profiling 的比较范围见页面中的统计规则。

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
