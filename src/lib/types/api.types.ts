export interface IApiResponse<TData = unknown> {
  status: number;
  message: string;
  data: TData;
}