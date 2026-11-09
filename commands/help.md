---
description: 说明 zcode-next-suggestions 怎么用
---

简要说明本插件（用中文）：

- **做什么**：每轮有实质进展时，回复末尾给出最多 3 条「接下来」建议，并同步到会话侧栏 chips。
- **侧栏**：点击「写入输入区」会调用 `updateModelContext`（挂到输入区，可删，不自动发送）；点击「直接发送」会调用 `sendFollowUpMessage`。
- **命令**：`/next 1`（或 2/3）立刻执行对应建议；只输入 `/next` 重列。
- **限制**：交互侧栏主要适用于 ZCode Desktop 本地工作区。
- **开关**：卸载或禁用插件即可。
