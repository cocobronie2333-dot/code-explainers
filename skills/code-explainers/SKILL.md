---
name: code-explainers
description: 当用户想理解软件特性、源码或执行调用链时，基于实际代码生成交互式 HTML，并发布到个人 code-explainers 仓库和 GitHub Pages 目录首页。也用于更新讲解和目录；普通代码修复与实现任务不触发。
---

# 代码讲解与发布

用户的个人偏好：讲解特性 / 代码时，默认交付交互式 HTML，并统一发布到以下专用仓库。若本轮只要文字、只要本地文件、禁止公开或指定别的目标，以本轮要求为准。

- 仓库：`https://github.com/cocobronie2333-dot/code-explainers`
- 首页：`https://cocobronie2333-dot.github.io/code-explainers/`
- 默认 checkout：`D:/workspace/code-explainers`。不存在时先确认远端，再 clone；其它机器可另选可写目录。
- 每个主题：`<slug>/index.html`。目录数据：`catalog.json`。首页：根目录 `index.html`。

## 内容与交互

读实际源码并记录 commit。按真实执行阶段、进程 / 线程、数据流和依赖解释，明确区分事实与简化假设。用贯穿实例追踪输入、命中、标识符、元数据形状和具体接口。

适合并行流程时，采用可点击的多泳道时间线，表达 step 初始化、forward 初始化、Attention 开始与完成等边界。条长不是实测耗时；CPU 提交不等于设备完成；不要凭示意图断言实际性能。

优先单文件、无构建依赖的 HTML，支持离线和窄屏。现有 `kv-cache-pooling/index.html` 是设计参考，不是强制模板。使用固定 commit 的源码 permalink；站内链接使用相对路径。

## 登记和首页

运行 `scripts/manage_explainers.py` 登记主题并重建静态首页。新 slug 新增，同 slug 更新；摘要和标签要便于以后检索。脚本会转换已知 `SOURCES` 中的本地路径标识，不上传附件、截图、依赖或凭据。

```powershell
python <skill-dir>/scripts/manage_explainers.py add --repo-dir D:/workspace/code-explainers --html <absolute-html-path> --slug <ascii-slug> --title <title> --summary <summary> --tags vllm,cache --source-revision vllm=<commit>
```

验证页面主交互、元数据和实际接口对应关系，以及首页目录链接。可用浏览器时检查桌面与窄屏；未做设备测试时不要声称验证了硬件行为。

## 发布

在干净且与远端同步的专用 checkout 中，给上面的 `add` 命令增加 `--publish`。脚本只暂存当前主题、目录和首页，创建带 sign-off 的提交，普通 push 到 main，并等待 Pages 构建及 HTTP 验证。

如果先不带 `--publish` 登记以供验证，验证后手工明确暂存那三个路径，`git commit -s` 后 push，再运行：

```powershell
python <skill-dir>/scripts/manage_explainers.py verify --repo-dir D:/workspace/code-explainers --slug <slug>
```

用户已授权本工作流向该专用仓库发布其请求的讲解，无需反复确认。授权不涵盖无关私有代码、其它仓库或改变可见性。检查最终发布文件，保留必要来源与许可证说明。

脚本拒绝错误的 origin、脏 checkout、非 main 分支、额外本地提交或非快进更新。认证 / 权限 / 构建失败时保留已完成结果，检查具体错误后报告；不要循环建仓、force push 或丢弃改动。

交付首页和主题网址、简短验证结果。只有 Pages 已构建且主题返回预期内容，才说部署完成。
