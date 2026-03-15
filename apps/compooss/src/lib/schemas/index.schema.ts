import { z } from "zod";

const indexDirectionSchema = z.enum([
  "1",
  "-1",
  "text",
  "2dsphere",
  "2d",
  "hashed",
]);

export const indexFieldSchema = z.object({
  field: z.string().min(1, { message: "Field name is required." }),
  direction: indexDirectionSchema,
});

export const createIndexSchema = z
  .object({
    fields: z
      .array(indexFieldSchema)
      .min(1, { message: "At least one index field is required." }),
    name: z.string().optional(),
    unique: z.boolean().default(false),
    sparse: z.boolean().default(false),
    hidden: z.boolean().default(false),
    expireAfterSeconds: z
      .number()
      .int()
      .min(0)
      .max(2147483647)
      .optional()
      .nullable(),
    partialFilterExpression: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.expireAfterSeconds != null && data.expireAfterSeconds > 0) {
        return data.fields.length === 1;
      }
      return true;
    },
    { message: "TTL index must have exactly one field.", path: ["expireAfterSeconds"] },
  );

export type TCreateIndexFormValues = z.infer<typeof createIndexSchema>;

export type TIndexFieldForm = z.infer<typeof indexFieldSchema>;
