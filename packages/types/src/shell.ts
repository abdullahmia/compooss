export interface ShellRequest {
  command: string;
  database: string;
}

export type ShellResponseType = "result" | "error" | "info" | "switchDb";

export interface ShellResponse {
  result: unknown;
  type: ShellResponseType;
  database: string;
  executionTimeMs: number;
}

export interface ShellEntry {
  id: string;
  command: string;
  database: string;
  response: ShellResponse;
  timestamp: number;
}
