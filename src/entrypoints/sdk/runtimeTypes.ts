/**
 * SDK Runtime types - Non-serializable types (callbacks, interfaces with methods).
 * Stub for compilation.
 */

export type AnyZodRawShape = Record<string, any>;
export type InferShape<T> = any;

export type Options = Record<string, any>;
export type InternalOptions = Options & { _internal?: boolean };

export interface Query {
  [Symbol.asyncIterator](): AsyncIterator<any>;
  abort(): void;
  result: Promise<any>;
}
export type InternalQuery = Query;

export interface SDKSession {
  sendMessage(message: string | any[]): void;
  getMessages(): Promise<any[]>;
  abort(): void;
  result: Promise<any>;
  [Symbol.asyncIterator](): AsyncIterator<any>;
}

export type SDKSessionOptions = {
  model?: string;
  maxTokens?: number;
  systemPrompt?: string;
  appendSystemPrompt?: string;
  mcpServers?: any[];
  tools?: any[];
  permissionMode?: string;
  dir?: string;
  resume?: boolean;
  sessionId?: string;
  enableRemoteControl?: boolean;
  [key: string]: any;
};

export type ForkSessionOptions = {
  dir?: string;
  upToMessageId?: string;
  title?: string;
};
export type ForkSessionResult = { sessionId: string };
export type GetSessionInfoOptions = { dir?: string };
export type GetSessionMessagesOptions = {
  dir?: string;
  limit?: number;
  offset?: number;
  includeSystemMessages?: boolean;
};
export type ListSessionsOptions = {
  dir?: string;
  limit?: number;
  offset?: number;
};
export type SessionMutationOptions = { dir?: string };

export type SessionMessage = any;

export type McpSdkServerConfigWithInstance = any;

export type SdkMcpToolDefinition<T = any> = {
  name: string;
  description: string;
  inputSchema: T;
  handler: (args: any, extra: unknown) => Promise<any>;
  annotations?: any;
  searchHint?: string;
  alwaysLoad?: boolean;
};

export type EffortLevel = 'low' | 'medium' | 'high' | 'max';
