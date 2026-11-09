---
name: zcode-next-suggestions
description: Suggest up to 3 next user prompts after a turn, or continue one via /next. Use when the user wants follow-up suggestions or a convenient next-step workflow in ZCode.
---

# zcode-next-suggestions

创建于 2026-11-09

在回复末尾给出编号建议，用户用 `/next N` 一键续发。

## 收尾块

有实质进展时，在回复末尾追加：

### 接下来
1. …
2. …
3. …

并提示：`/next 1` 执行对应项；`/next` 重列。

## 规则

- 最多 3 条；没有合理后续就省略整块。
- 每条是可直接发送的用户请求，短、具体、用用户语言。
- 不重复已完成工作；不编造待办。
- 不自动执行；等 `/next N` 或用户粘贴发送。
