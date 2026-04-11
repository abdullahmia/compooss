import { z } from "zod";

export const createDatabaseSchema = z.object({
  dbName: z
    .string()
    .min(1, { message: "Database name is required." })
    .regex(/^[a-zA-Z0-9_\-]+$/, {
      message:
        "Database name can only contain letters, numbers, underscores, and hyphens.",
    }),
  collectionName: z
    .string()
    .min(1, { message: "Collection name is required." })
    .regex(/^[a-zA-Z0-9_\-]+$/, {
      message:
        "Collection name can only contain letters, numbers, underscores, and hyphens.",
    }),
});

export type TCreateDatabaseFormData = z.input<typeof createDatabaseSchema>;

