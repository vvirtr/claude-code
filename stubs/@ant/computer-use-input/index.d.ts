export interface ComputerUseInputAPI {
  key(key: string): Promise<void>;
  keys(keys: string[]): Promise<void>;
  type(text: string): Promise<void>;
  click(x: number, y: number): Promise<void>;
  [key: string]: any;
}

export type ComputerUseInput =
  | (ComputerUseInputAPI & { isSupported: true })
  | { isSupported: false };
