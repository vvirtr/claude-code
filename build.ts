/// <reference types="bun-types" />

/**
 * Build script for Claude Code.
 * Run with: bun run build.ts
 */

const FEATURE_FLAGS: Record<string, boolean> = {
  ABLATION_BASELINE: false,
  AGENT_MEMORY_SNAPSHOT: false,
  AGENT_TRIGGERS: false,
  AGENT_TRIGGERS_REMOTE: false,
  ALLOW_TEST_VERSIONS: false,
  ANTI_DISTILLATION_CC: false,
  AUTO_THEME: true,
  AWAY_SUMMARY: false,
  BASH_CLASSIFIER: false,
  BG_SESSIONS: false,
  BREAK_CACHE_COMMAND: false,
  BRIDGE_MODE: false,
  BUDDY: false,
  BUILDING_CLAUDE_APPS: false,
  BUILTIN_EXPLORE_PLAN_AGENTS: true,
  BYOC_ENVIRONMENT_RUNNER: false,
  CACHED_MICROCOMPACT: false,
  CCR_AUTO_CONNECT: false,
  CCR_MIRROR: false,
  CCR_REMOTE_SETUP: false,
  CHICAGO_MCP: false,
  COMMIT_ATTRIBUTION: true,
  COMPACTION_REMINDERS: true,
  CONNECTOR_TEXT: false,
  CONTEXT_COLLAPSE: true,
  COORDINATOR_MODE: false,
  COWORKER_TYPE_TELEMETRY: false,
  DAEMON: false,
  DIRECT_CONNECT: false,
  DOWNLOAD_USER_SETTINGS: false,
  DUMP_SYSTEM_PROMPT: false,
  ENHANCED_TELEMETRY_BETA: false,
  EXPERIMENTAL_SKILL_SEARCH: false,
  EXTRACT_MEMORIES: true,
  FILE_PERSISTENCE: false,
  FORK_SUBAGENT: false,
  HARD_FAIL: false,
  HISTORY_PICKER: true,
  HISTORY_SNIP: false,
  HOOK_PROMPTS: true,
  IS_LIBC_GLIBC: process.platform === "linux",
  IS_LIBC_MUSL: false,
  KAIROS: false,
  KAIROS_BRIEF: false,
  KAIROS_CHANNELS: false,
  KAIROS_DREAM: false,
  KAIROS_GITHUB_WEBHOOKS: false,
  KAIROS_PUSH_NOTIFICATION: false,
  LODESTONE: false,
  MCP_RICH_OUTPUT: true,
  MCP_SKILLS: false,
  MEMORY_SHAPE_TELEMETRY: false,
  MESSAGE_ACTIONS: true,
  MONITOR_TOOL: false,
  NATIVE_CLIENT_ATTESTATION: false,
  NATIVE_CLIPBOARD_IMAGE: false,
  NEW_INIT: false,
  OVERFLOW_TEST_TOOL: false,
  PERFETTO_TRACING: false,
  POWERSHELL_AUTO_MODE: false,
  PROACTIVE: false,
  PROMPT_CACHE_BREAK_DETECTION: false,
  QUICK_SEARCH: false,
  REACTIVE_COMPACT: false,
  REVIEW_ARTIFACT: false,
  RUN_SKILL_GENERATOR: false,
  SELF_HOSTED_RUNNER: false,
  SHOT_STATS: false,
  SKILL_IMPROVEMENT: false,
  SLOW_OPERATION_LOGGING: false,
  SSH_REMOTE: false,
  STREAMLINED_OUTPUT: true,
  TEAMMEM: false,
  TEMPLATES: false,
  TERMINAL_PANEL: false,
  TOKEN_BUDGET: false,
  TORCH: false,
  TRANSCRIPT_CLASSIFIER: false,
  TREE_SITTER_BASH: false,
  TREE_SITTER_BASH_SHADOW: false,
  UDS_INBOX: false,
  ULTRAPLAN: false,
  ULTRATHINK: false,
  UNATTENDED_RETRY: false,
  UPLOAD_USER_SETTINGS: false,
  VERIFICATION_AGENT: false,
  VOICE_MODE: false,
  WEB_BROWSER_TOOL: false,
  WORKFLOW_SCRIPTS: false,
};

const version = process.env.VERSION || "2.1.88";
const buildTime = new Date().toISOString();

const define: Record<string, string> = {
  "MACRO.VERSION": JSON.stringify(version),
  "MACRO.BUILD_TIME": JSON.stringify(buildTime),
  "MACRO.BUILD_TIMESTAMP": JSON.stringify(buildTime.split("T")[0]),
  "MACRO.FEEDBACK_CHANNEL": JSON.stringify("#claude-code-feedback"),
  "MACRO.ISSUES_EXPLAINER": JSON.stringify(
    "report issues at https://github.com/anthropics/claude-code/issues"
  ),
  "MACRO.NATIVE_PACKAGE_URL": JSON.stringify("@anthropic-ai/claude-code"),
  "MACRO.PACKAGE_URL": JSON.stringify("@anthropic-ai/claude-code"),
  "MACRO.VERSION_CHANGELOG": JSON.stringify(""),
};

const result = await Bun.build({
  entrypoints: ["./src/entrypoints/cli.tsx"],
  outdir: "./dist",
  target: "bun",
  format: "esm",
  splitting: true,
  sourcemap: "external",
  minify: false,
  define,
  external: [
    // Cloud SDKs (dynamic imports, optional)
    "@anthropic-ai/bedrock-sdk",
    "@anthropic-ai/vertex-sdk",
    "@anthropic-ai/foundry-sdk",
    "@aws-sdk/client-bedrock",
    "@aws-sdk/client-bedrock-runtime",
    "@aws-sdk/credential-providers",
    "@aws-sdk/credential-provider-node",
    "@smithy/node-http-handler",
    "@smithy/core",
    "@azure/identity",
    "google-auth-library",
    // OpenTelemetry (dynamic imports)
    "@opentelemetry/api",
    "@opentelemetry/api-logs",
    "@opentelemetry/core",
    "@opentelemetry/resources",
    "@opentelemetry/sdk-logs",
    "@opentelemetry/sdk-metrics",
    "@opentelemetry/sdk-trace-base",
    "@opentelemetry/semantic-conventions",
    "@opentelemetry/exporter-metrics-otlp-grpc",
    "@opentelemetry/exporter-metrics-otlp-http",
    "@opentelemetry/exporter-metrics-otlp-proto",
    "@opentelemetry/exporter-logs-otlp-grpc",
    "@opentelemetry/exporter-logs-otlp-http",
    "@opentelemetry/exporter-logs-otlp-proto",
    "@opentelemetry/exporter-trace-otlp-grpc",
    "@opentelemetry/exporter-trace-otlp-http",
    "@opentelemetry/exporter-trace-otlp-proto",
    "@opentelemetry/exporter-prometheus",
    // Native packages (optional, dynamic imports)
    "sharp",
    // Other optional
    "@aws-sdk/client-sts",
    // FFI
    "bun:ffi",
  ],
  plugins: [
    {
      name: "feature-flags",
      setup(build) {
        build.onResolve({ filter: /^bun:bundle$/ }, () => ({
          path: "bun:bundle",
          namespace: "bun-bundle-shim",
        }));

        build.onLoad(
          { filter: /.*/, namespace: "bun-bundle-shim" },
          () => ({
            contents: `
              const FLAGS = ${JSON.stringify(FEATURE_FLAGS)};
              export function feature(flag) {
                return FLAGS[flag] ?? false;
              }
            `,
            loader: "js",
          })
        );
      },
    },
  ],
});

if (!result.success) {
  console.error("Build failed:");
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

console.log(
  `Build succeeded: ${result.outputs.length} files written to ./dist/`
);
