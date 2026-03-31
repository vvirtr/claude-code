export interface ComputerUseAPI {
  screenshot(options?: any): Promise<any>;
  click(x: number, y: number, options?: any): Promise<void>;
  type(text: string, options?: any): Promise<void>;
  key(keys: string[], options?: any): Promise<void>;
  scroll(x: number, y: number, options?: any): Promise<void>;
  cursor_position(): Promise<{ x: number; y: number }>;
  [key: string]: any;
}
