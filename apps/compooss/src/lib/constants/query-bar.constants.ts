export const DEFAULT_FILTER = "{ }";
export const DEFAULT_PROJECT = "{ }";
export const DEFAULT_SORT = "{ }";
export const DEFAULT_LIMIT = 20;
export const DEFAULT_SKIP = 0;

export const QUERY_BAR_DEFAULT_STATE = {
  filter: DEFAULT_FILTER,
  project: DEFAULT_PROJECT,
  sort: DEFAULT_SORT,
  limit: DEFAULT_LIMIT,
  skip: DEFAULT_SKIP,
} as const;
