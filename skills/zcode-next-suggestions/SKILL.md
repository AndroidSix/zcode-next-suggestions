---
name: zcode-next-suggestions
description: Suggest up to 3 next user prompts after a turn via sidebar chips and /next. Use when the user wants follow-up suggestions or a convenient next-step workflow in ZCode.
---

# zcode-next-suggestions

创建于 2026-11-09

在回复末尾给出编号建议，并写入侧栏 chips；用户可点击写入输入区上下文、直接发送，或用 `/next N` 续发。

## 收尾动作

有实质进展时：

1. 回复末尾追加：

### 接下来
1. …
2. …
3. …

2. 调用工具 `next_suggestions_set`，`suggestions` 为同样的字符串数组（最多 3 条）。

没有合理后续时：省略文末块，并调用 `next_suggestions_clear`（或 `next_suggestions_set` 传空数组）。

## 规则

- 每条是可直接发送的用户请求，短、具体、用用户语言。
- 不重复已完成工作；不编造待办。
- 不自动执行；等用户点击侧栏、`/next N` 或粘贴发送。
