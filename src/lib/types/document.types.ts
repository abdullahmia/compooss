export type TDocument = {
  _id: string;
  [key: string]: any;
}

export type TGetDocumentsResponse = {
  data: TDocument[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}