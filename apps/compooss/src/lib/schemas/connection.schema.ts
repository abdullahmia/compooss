import { z } from "zod";

export const ConnectionSchema = z.object({
  connectionString: z.string().min(1, {
    message: "Connection string is required!",
  }),
  connectionName: z.string().min(1, {
    message: "Connection name is required!",
  }),
  isFavorite: z.boolean(),
});
export type TConnectionSchema = z.infer<typeof ConnectionSchema>;
