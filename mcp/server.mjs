#!/usr/bin/env node
/**
 * Zero-dependency stdio MCP server for zcode-next-suggestions.
 * Serves a session sidebar HTML page and tools to set/get suggestion chips.
 */
import { createInterface } from "node:readline";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PANEL_URI = "ui://zcode-next-suggestions/panel.html";
const SERVER_INFO = { name: "zcode-next-suggestions", version: "0.2.0" };

const dataDir = process.env.ZCODE_PLUGIN_DATA || join(ROOT, ".data");
const statePath = join(dataDir, "suggestions.json");

/** @type {{ suggestions: string[], updatedAt: string | null }} */
let state = { suggestions: [], updatedAt: null };

async function loadState() {
  try {
    const raw = JSON.parse(await readFile(statePath, "utf8"));
    if (Array.isArray(raw?.suggestions)) {
      state = {
        suggestions: raw.suggestions
          .filter((item) => typeof item === "string" && item.trim())
          .map((item) => item.trim().slice(0, 240))
          .slice(0, 3),
        updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : null,
      };
    }
  } catch {
    /* first run or unreadable */
  }
}

async function saveState() {
  await mkdir(dataDir, { recursive: true });
  await writeFile(statePath, JSON.stringify(state, null, 2) + "\n", "utf8");
}

function writeMessage(message) {
  process.stdout.write(JSON.stringify(message) + "\n");
}

function ok(id, result) {
  writeMessage({ jsonrpc: "2.0", id, result });
}

function fail(id, code, message) {
  writeMessage({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });
}

function normalizeSuggestions(input) {
  const list = Array.isArray(input) ? input : [];
  return [
    ...new Set(
      list
        .filter((item) => typeof item === "string")
        .map((item) => item.replace(/[\u0000-\u001f\u007f]/g, " ").trim())
        .filter(Boolean)
        .map((item) => item.slice(0, 240)),
    ),
  ].slice(0, 3);
}

function textResult(text, structuredContent, meta = undefined) {
  return {
    content: [{ type: "text", text }],
    structuredContent,
    isError: false,
    ...(meta ? { _meta: meta } : {}),
  };
}

const TOOLS = [
  {
    name: "next_suggestions_set",
    description:
      "Set up to 3 next-step suggestion chips for the session sidebar. Call at the end of a turn when there are useful follow-ups.",
    inputSchema: {
      type: "object",
      properties: {
        suggestions: {
          type: "array",
          description: "1–3 short actionable user prompts in the user's language.",
          items: { type: "string" },
          minItems: 0,
          maxItems: 3,
        },
      },
      required: ["suggestions"],
    },
    annotations: { readOnlyHint: false },
    _meta: {
      ui: {
        resourceUri: PANEL_URI,
        surface: "suggestions",
        visibility: ["model", "app"],
      },
    },
  },
  {
    name: "next_suggestions_get",
    description: "Read the current next-step suggestion chips.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    _meta: { ui: { visibility: ["app"] } },
  },
  {
    name: "next_suggestions_clear",
    description: "Clear the current next-step suggestion chips.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: false },
    _meta: {
      ui: {
        resourceUri: PANEL_URI,
        surface: "suggestions",
        visibility: ["model", "app"],
      },
    },
  },
  {
    name: "next_suggestions_open",
    description: "Open the Next Suggestions sidebar panel.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    _meta: {
      ui: {
        resourceUri: PANEL_URI,
        surface: "suggestions",
        visibility: ["model", "app"],
      },
    },
  },
];

async function handleRequest(msg) {
  const { id, method, params } = msg;
  if (id === undefined || id === null) return;

  switch (method) {
    case "initialize":
      ok(id, {
        protocolVersion: params?.protocolVersion || "2025-11-25",
        capabilities: { tools: {}, resources: { subscribe: true } },
        serverInfo: SERVER_INFO,
      });
      return;
    case "ping":
      ok(id, {});
      return;
    case "tools/list":
      ok(id, { tools: TOOLS });
      return;
    case "resources/list":
      ok(id, {
        resources: [
          {
            uri: PANEL_URI,
            name: "Next Suggestions",
            description: "Sidebar chips for next prompts",
            mimeType: "text/html;profile=mcp-app",
          },
        ],
      });
      return;
    case "resources/templates/list":
      ok(id, { resourceTemplates: [] });
      return;
    case "resources/subscribe":
    case "resources/unsubscribe":
      ok(id, {});
      return;
    case "resources/read": {
      if (params?.uri !== PANEL_URI) {
        fail(id, -32002, `Unknown resource: ${params?.uri}`);
        return;
      }
      const html = await readFile(join(ROOT, "ui", "panel.html"), "utf8");
      ok(id, {
        contents: [
          {
            uri: PANEL_URI,
            mimeType: "text/html;profile=mcp-app",
            text: html,
            _meta: { ui: { backgroundRetention: true } },
          },
        ],
      });
      return;
    }
    case "tools/call": {
      const name = params?.name;
      const args = params?.arguments || {};
      if (name === "next_suggestions_set") {
        state = {
          suggestions: normalizeSuggestions(args.suggestions),
          updatedAt: new Date().toISOString(),
        };
        await saveState().catch(() => {});
        ok(
          id,
          textResult(
            state.suggestions.length
              ? `已更新 ${state.suggestions.length} 条下一步建议。`
              : "已清空下一步建议。",
            { suggestions: state.suggestions, updatedAt: state.updatedAt },
            {
              ui: {
                resourceUri: PANEL_URI,
                surface: "suggestions",
              },
            },
          ),
        );
        return;
      }
      if (name === "next_suggestions_get") {
        ok(
          id,
          textResult(
            state.suggestions.length
              ? state.suggestions.map((item, i) => `${i + 1}. ${item}`).join("\n")
              : "暂无建议。",
            { suggestions: state.suggestions, updatedAt: state.updatedAt },
          ),
        );
        return;
      }
      if (name === "next_suggestions_clear") {
        state = { suggestions: [], updatedAt: new Date().toISOString() };
        await saveState().catch(() => {});
        ok(
          id,
          textResult("已清空下一步建议。", {
            suggestions: [],
            updatedAt: state.updatedAt,
          }),
        );
        return;
      }
      if (name === "next_suggestions_open") {
        ok(
          id,
          textResult("已打开下一步建议面板。", {
            suggestions: state.suggestions,
            updatedAt: state.updatedAt,
          }),
        );
        return;
      }
      fail(id, -32601, `Unknown tool: ${name}`);
      return;
    }
    default:
      fail(id, -32601, `Method not found: ${method}`);
  }
}

await loadState();

let pending = 0;
let stdinClosed = false;

function track(promise) {
  pending += 1;
  Promise.resolve(promise)
    .catch((err) => {
      process.stderr.write(`[zcode-next-suggestions] request failed: ${err}\n`);
    })
    .finally(() => {
      pending -= 1;
      if (stdinClosed && pending === 0) process.exit(0);
    });
}

const rl = createInterface({ input: process.stdin });
rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const msg = JSON.parse(trimmed);
    if (Array.isArray(msg)) for (const item of msg) track(handleRequest(item));
    else track(handleRequest(msg));
  } catch (err) {
    process.stderr.write(`[zcode-next-suggestions] bad JSON: ${err}\n`);
  }
});
rl.on("close", () => {
  stdinClosed = true;
  if (pending === 0) process.exit(0);
});
process.stderr.write("[zcode-next-suggestions] stdio MCP server ready\n");
