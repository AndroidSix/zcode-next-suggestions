#!/usr/bin/env node
/** Inject next-suggestion rules at session start. */

const additionalContext = [
  "[zcode-next-suggestions]",
  "当本轮有实质进展时，在对用户可见回复的末尾追加「接下来」编号列表（最多 3 条）。",
  "每条写成可直接发送的短用户请求，使用用户语言；不要重复已完成工作，没有合理后续就省略整块。",
  "格式示例：",
  "### 接下来",
  "1. …",
  "2. …",
  "3. …",
  "提示用户：输入 `/next 1`（或 2/3）执行对应项；只输入 `/next` 可重列。",
  "不要自动执行这些建议，除非用户发出 `/next N` 或明确发送了其中一条。",
].join("\n");

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext,
    },
  }),
);
