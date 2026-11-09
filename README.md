# zcode-next-suggestions

创建于 2026-11-09

ZCode 插件：对话有实质进展后，在回复末尾给出最多 3 条「接下来」建议；用 `/next N` 一键续发。

## 功能

| 能力 | 说明 |
| --- | --- |
| 自动建议 | `SessionStart` 注入收尾规则，回复末尾输出编号列表 |
| `/next` | 重列最近建议 |
| `/next 1` | 立刻执行第 1 条（2/3 同理） |
| `/help` | 查看本插件说明 |

## 安装

### 从 GitHub 安装

1. 打开 ZCode **插件市场 → 添加 → 添加插件市场**
2. 粘贴仓库地址：`https://github.com/AndroidSix/zcode-next-suggestions`
3. 在市场列表中找到 **Next Suggestions / 下一步建议**，点击安装
4. **新建任务**后试用（旧任务可能看不到新命令）

也可把本仓库当作本地市场根目录添加（目录内含 `marketplace.json`）。

### 本地开发

```text
zcode-next-suggestions/
  .zcode-plugin/plugin.json
  commands/
  hooks/
  scripts/
  skills/
  marketplace.json   # 可选：本仓库自带测试清单
```

## 用法

1. 正常对话；有实质进展时，回复末尾会出现「接下来」1–3 条。
2. 输入 `/next 1` 执行第 1 条。
3. 只输入 `/next` 可重列建议。

## 许可

MIT © AndroidSix
