export interface McpbManifest {
  name: string;
  version: string;
  [key: string]: any;
}

export interface McpbUserConfigurationOption {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  default?: any;
}

export declare const McpbManifestSchema: {
  safeParse(data: unknown): { success: true; data: McpbManifest } | { success: false; error: { flatten(): any } };
  parse(data: unknown): McpbManifest;
};
