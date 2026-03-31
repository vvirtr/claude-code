// Stub: connector text types not included in leaked source
export interface ConnectorTextBlock {
  type: 'connector_text';
  text: string;
  [key: string]: any;
}

export function isConnectorTextBlock(block: any): block is ConnectorTextBlock {
  return block?.type === 'connector_text';
}
