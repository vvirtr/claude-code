#!/bin/bash
# Creates stub packages in node_modules for internal Anthropic packages
# Run after: bun install

set -e

create_stub() {
  local pkg_dir="node_modules/$1"
  mkdir -p "$pkg_dir"
  echo "{\"name\":\"$1\",\"version\":\"0.0.0-stub\",\"main\":\"index.js\"}" > "$pkg_dir/package.json"
  cat > "$pkg_dir/index.js" <<< "$2"
  echo "  Created: $1"
}

echo "Setting up stub packages..."

# @anthropic-ai/sandbox-runtime
mkdir -p node_modules/@anthropic-ai/sandbox-runtime
cat > node_modules/@anthropic-ai/sandbox-runtime/package.json << 'PKGJSON'
{"name":"@anthropic-ai/sandbox-runtime","version":"0.0.0-stub","main":"index.js","type":"module"}
PKGJSON
cat > node_modules/@anthropic-ai/sandbox-runtime/index.js << 'STUBJS'
import { z } from 'zod';
const noop = () => {};
export class SandboxManager {
  constructor(config) { this.config = config; }
  static isSupportedPlatform() { return false; }
  static isSandboxingEnabled() { return false; }
  static isAutoAllowBashIfSandboxedEnabled() { return false; }
  static checkDependencies() { return { satisfied: true, missing: [] }; }
  static async initialize() {}
  static updateConfig() {}
  static setSandboxSettings() {}
  static async reset() {}
  static wrapWithSandbox(cmd, args, opts) { return { cmd, args, opts }; }
  static refreshConfig() {}
  static getFsReadConfig() { return null; }
  static getFsWriteConfig() { return null; }
  static getNetworkRestrictionConfig() { return null; }
  static getIgnoreViolations() { return null; }
  static getAllowUnixSockets() { return false; }
  static getAllowLocalBinding() { return false; }
  static getEnableWeakerNestedSandbox() { return false; }
  static getProxyPort() { return null; }
  static getSocksProxyPort() { return null; }
  static getLinuxHttpSocketPath() { return null; }
  static getLinuxSocksSocketPath() { return null; }
  static getLinuxGlobPatternWarnings() { return []; }
  static getExcludedCommands() { return []; }
  static async waitForNetworkInitialization() {}
  static getSandboxViolationStore() { return new SandboxViolationStore(); }
  static annotateStderrWithSandboxFailures(s) { return s; }
  static async cleanupAfterCommand() {}
}
export class SandboxViolationStore {
  constructor() { this.violations = []; }
  getViolations() { return this.violations; }
  add(v) { this.violations.push(v); }
  getAll() { return this.violations; }
  clear() { this.violations = []; }
}
export const SandboxRuntimeConfigSchema = z.object({}).passthrough();
STUBJS
echo "  Created: @anthropic-ai/sandbox-runtime"

# @ant/claude-for-chrome-mcp
mkdir -p node_modules/@ant/claude-for-chrome-mcp
cat > node_modules/@ant/claude-for-chrome-mcp/package.json << 'PKGJSON'
{"name":"@ant/claude-for-chrome-mcp","version":"0.0.0-stub","main":"index.js","type":"module"}
PKGJSON
cat > node_modules/@ant/claude-for-chrome-mcp/index.js << 'STUBJS'
export const BROWSER_TOOLS = [];
export function createChromeServer() { return null; }
export function createClaudeForChromeMcpServer() { return null; }
export async function startChromeServer() { return null; }
STUBJS
echo "  Created: @ant/claude-for-chrome-mcp"

# color-diff-napi
mkdir -p node_modules/color-diff-napi
cat > node_modules/color-diff-napi/package.json << 'PKGJSON'
{"name":"color-diff-napi","version":"0.0.0-stub","main":"index.js","type":"module"}
PKGJSON
cat > node_modules/color-diff-napi/index.js << 'STUBJS'
export class ColorDiff { constructor() {} render() { return null; } }
export class ColorFile { constructor() {} highlight() { return ''; } }
export function getSyntaxTheme() { return null; }
STUBJS
echo "  Created: color-diff-napi"

# Simple CJS stubs
for pkg in "@anthropic-ai/foundry-sdk" "@anthropic-ai/mcpb" \
           "@ant/computer-use-mcp" "@ant/computer-use-swift" "@ant/computer-use-input" \
           "modifiers-napi" "audio-capture-napi" "image-processor-napi" "url-handler-napi"; do
  dir="node_modules/$pkg"
  mkdir -p "$dir"
  echo "{\"name\":\"$pkg\",\"version\":\"0.0.0-stub\",\"main\":\"index.js\"}" > "$dir/package.json"
  echo "module.exports = {};" > "$dir/index.js"
  echo "  Created: $pkg"
done

# @ant/computer-use-mcp subpath exports
cat > node_modules/@ant/computer-use-mcp/index.js << 'STUBJS'
const DEFAULT_GRANT_FLAGS = {};
const API_RESIZE_PARAMS = {};
module.exports = {
  bindSessionContext: () => ({}), buildComputerUseTools: () => [],
  createComputerUseMcpServer: () => null, API_RESIZE_PARAMS,
  targetImageSize: () => ({}), DEFAULT_GRANT_FLAGS,
};
STUBJS
cat > node_modules/@ant/computer-use-mcp/types.js << 'STUBJS'
module.exports = { DEFAULT_GRANT_FLAGS: {}, CoordinateMode: '', CuSubGates: {} };
STUBJS
cat > node_modules/@ant/computer-use-mcp/sentinelApps.js << 'STUBJS'
module.exports = { getSentinelCategory: () => undefined };
STUBJS

# @anthropic-ai/mcpb
cat > node_modules/@anthropic-ai/mcpb/index.js << 'STUBJS'
const McpbManifestSchema = {
  safeParse: (v) => ({ success: true, data: v }),
  parse: (v) => v,
};
module.exports = { McpbManifestSchema };
STUBJS

echo ""
echo "All stubs created. Run: bun run build"
