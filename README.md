# Code Explainers · 代码讲解集

用交互式 HTML 解释真实源码中的特性、调用链、数据流与并行依赖。

- [目录首页](https://cocobronie2333-dot.github.io/code-explainers/)
- [KV Cache 池化：Memcache / Mooncake](https://cocobronie2333-dot.github.io/code-explainers/kv-cache-pooling/)

## 组织方式

```text
index.html                 可搜索的目录首页
catalog.json               标题、摘要、标签、更新时间和源码版本
kv-cache-pooling/index.html 当前池化讲解
skills/code-explainers/     配套 Codex skill、发布脚本与目录模板
<new-topic>/index.html      后续独立主题
```

每篇讲解尽量保持单文件、离线可读，并使用固定 commit 的源码链接。图中的事件宽度、地址和数据规模若为教学假设，会在页面中说明。

## 新增和更新

使用个人 Codex skill `$code-explainers`：读取源码、生成或修改主题 HTML、登记 `catalog.json`、同步重建首页，再提交发布。可以指定仅本地生成。

手动维护时，为主题创建独立目录，将最终文档放为 `index.html`，并更新目录及首页。不要提交截图、聊天附件、依赖目录或本地凭据。

GitHub Pages 从 `main` 分支根目录发布；推送后自动构建。`.nojekyll` 保留纯静态 HTML，不依赖 Jekyll。

## 配套 skill

完整源码见 [skills/code-explainers](skills/code-explainers)，使用说明见 [SKILL.md](skills/code-explainers/SKILL.md)。目录包含界面配置、主题登记 / 发布脚本，以及首页模板。

将整个 `skills/code-explainers` 目录复制到个人 skills 目录，保留 `agents/`、`assets/` 和 `scripts/` 的相对结构。通常目标为 `~/.codex/skills/code-explainers`；Windows 下为 `%USERPROFILE%\.codex\skills\code-explainers`。

这个 skill 默认面向本仓库和对应 Pages 站点。用于其它账号时，需同步调整说明和脚本中的目标仓库与站点地址。

## 代码来源

当前主题基于以下固定版本：

- [vLLM · 24420b7a34](https://github.com/vllm-project/vllm/tree/24420b7a341af37a9bc3186e6fc6062512e0aa58)
- [vLLM Ascend · 76ea9d24f1](https://github.com/vllm-project/vllm-ascend/tree/76ea9d24f155afe032ad9ac6c98717f1f7334f36)

各页面内包含具体文件、行号和摘录链接。来源及许可证见 [NOTICE](NOTICE) 和 [LICENSE](LICENSE)。
