/**
 * SDK Utility types that can't be expressed as Zod schemas.
 * Stub for compilation.
 */
export type NonNullableUsage = {
  inputTokens: number;
  outputTokens: number;
  cacheReadInputTokens: number;
  cacheCreationInputTokens: number;
  webSearchRequests: number;
  costUSD: number;
  contextWindow: number;
  maxOutputTokens: number;
};
