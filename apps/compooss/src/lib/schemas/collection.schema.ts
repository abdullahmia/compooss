import { z } from "zod";

export const createCollectionSchema = z.object({
  collectionName: z
    .string()
    .min(1, { message: "Collection name is required." })
    .regex(/^[a-zA-Z0-9_\-]+$/, {
      message:
        "Collection name can only contain letters, numbers, underscores, and hyphens.",
    }),
});

export type TCreateCollectionInput = z.infer<typeof createCollectionSchema>;
