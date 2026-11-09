#!/usr/bin/env node
/** Inject next-suggestion rules at session start. */

const additionalContext = [
  "[zcode-next-suggestions]",
  "当本轮有实质进展时：",
  "1) 在对用户可见回复末尾追加「接下来」编号列表（最多 3 条）；",
  "2) 同时调用 MCP 工具 next_suggestions_set，把同样的 1–3 条写入侧栏 chips。",
  "每条写成可直接发送的短用户请求，使用用户语言；不要重复已完成工作，没有合理后续就省略文末块，并调用 next_suggestions_clear 或传入空数组。",
  "格式示例：",
  "### 接下来",
  "1. …",
  "2. …",
  "3. …",
  "提示用户：可在侧栏点击「写入输入区」或「直接发送」；也可用 `/next 1`（或 2/3）。",
  "不要自动执行这些建议，除非用户点击发送、发出 `/next N`，或明确发送了其中一条。",
].join("\n");

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext,
    },
  }),
);
