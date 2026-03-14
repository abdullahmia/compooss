export interface ApiResponse<TData = unknown> {
  status: number;
  message: string;
  data: TData;
}
