# zcode-next-suggestions

创建于 2026-11-09

ZCode UI 插件：对话有实质进展后，在回复末尾与会话侧栏给出最多 3 条「接下来」建议。

- 侧栏点击 **写入输入区**：`updateModelContext`（可见、可删，不立刻发送）
- 侧栏点击 **直接发送**：`sendFollowUpMessage`
- 也可 `/next N` 一键续发

## 功能

| 能力 | 说明 |
| --- | --- |
| 会话侧栏 | `ui.surfaces` → Next Suggestions / 下一步建议 |
| 自动建议 | `SessionStart` 注入规则；Agent 调用 `next_suggestions_set` |
| 写入输入区 | 点击 chip → 插件上下文进入输入区 |
| 直接发送 | 点击 chip → 以用户消息续跑 |
| `/next` | 重列；`/next 1` 执行第 1 条 |

## 要求

- ZCode Desktop **本地工作区**（交互侧栏能力）
- 已启用本插件，并允许其 MCP server

## 安装

1. ZCode **插件市场 → 添加 → 添加插件市场**
2. 粘贴：`https://github.com/AndroidSix/zcode-next-suggestions`
3. 安装 **Next Suggestions / 下一步建议**
4. **新建任务**后试用（旧任务可能看不到新能力）

本地开发也可把本仓库目录直接加为市场根（含 `marketplace.json`）。

## 用法

1. 正常对话；有实质进展后，文末与侧栏会出现建议。
2. 在侧栏点「写入输入区」或「直接发送」。
3. 或输入 `/next 1` 执行第 1 条。

## MCP 工具

- `next_suggestions_set` — 写入最多 3 条建议并打开/刷新面板
- `next_suggestions_get` — 读取当前建议
- `next_suggestions_clear` — 清空
- `next_suggestions_open` — 打开侧栏面板

## 许可

MIT © AndroidSix
