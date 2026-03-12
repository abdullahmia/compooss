'use server';

import {
  createDatabaseSchema,
  type TCreateDatabaseInput,
} from "@/lib/schemas/database.schema";
import { createDatabase } from "@/lib/services/database/database.service";

export interface ICreateDatabaseActionResult {
  ok: boolean;
  fieldErrors?: Partial<Record<keyof TCreateDatabaseInput, string>>;
  formError?: string;
}

export const createDatabaseAction = async (
  input: TCreateDatabaseInput,
): Promise<ICreateDatabaseActionResult> => {
  const parsed = createDatabaseSchema.safeParse(input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const path = (issue?.path?.[0] ?? "dbName") as keyof TCreateDatabaseInput;

    return {
      ok: false,
      fieldErrors: {
        [path]: issue?.message ?? "Invalid database or collection name.",
      },
    };
  }

  try {
    await createDatabase(parsed.data);
    return { ok: true };
  } catch (error: any) {
    console.error("Failed to create database", error);
    const isAlreadyExists =
      typeof error?.codeName === "string" &&
      error.codeName === "NamespaceExists";

    return {
      ok: false,
      formError: isAlreadyExists
        ? "Database and collection already exist."
        : "Failed to create database. Please verify the connection and try again.",
    };
  }
};

