import { BaseRepository } from "../base.repository";
import type {
  CollectionValidation,
  ValidationLevel,
  ValidationAction,
  UpdateValidationInput,
  CheckValidationInput,
  ValidationCheckResult,
  InvalidDocument,
} from "@compooss/types";
import { CollectionInfo } from "mongodb";

const DEFAULT_LEVEL: ValidationLevel = "strict";
const DEFAULT_ACTION: ValidationAction = "error";

export class ValidationRepository extends BaseRepository {
  async getValidation(
    databaseName: string,
    collectionName: string,
  ): Promise<CollectionValidation> {
    const db = await this.db(databaseName);
    const cols = await db
      .listCollections({ name: collectionName })
      .toArray();

    if (cols.length === 0) {
      throw new Error(
        `Collection "${collectionName}" not found in "${databaseName}".`,
      );
    }

    const info = cols[0] as CollectionInfo;
    const options = info.options ?? {};

    const validator =
      options.validator && typeof options.validator === "object"
        ? (options.validator as Record<string, unknown>)
        : null;

    const validationLevel =
      typeof options.validationLevel === "string"
        ? (options.validationLevel as ValidationLevel)
        : DEFAULT_LEVEL;

    const validationAction =
      typeof options.validationAction === "string"
        ? (options.validationAction as ValidationAction)
        : DEFAULT_ACTION;

    return { validator, validationLevel, validationAction };
  }

  async updateValidation(input: UpdateValidationInput): Promise<{ ok: boolean }> {
    const { databaseName, collectionName, validator, validationLevel, validationAction } = input;
    const db = await this.db(databaseName);

    await db.command({
      collMod: collectionName,
      validator,
      validationLevel,
      validationAction,
    });

    return { ok: true };
  }

  async checkDocuments(input: CheckValidationInput): Promise<ValidationCheckResult> {
    const { databaseName, collectionName, sampleSize = 1000 } = input;
    const db = await this.db(databaseName);
    const collection = db.collection(collectionName);

    const current = await this.getValidation(databaseName, collectionName);
    if (!current.validator || Object.keys(current.validator).length === 0) {
      const totalDocuments = await collection.countDocuments();
      return {
        totalDocuments,
        validCount: totalDocuments,
        invalidCount: 0,
        invalidDocuments: [],
      };
    }

    const totalDocuments = await collection.countDocuments();

    const invalidDocs = await collection
      .aggregate([
        { $match: { $nor: [current.validator] } },
        { $limit: sampleSize },
        { $project: { _id: 1 } },
      ])
      .toArray();

    const invalidDocuments: InvalidDocument[] = invalidDocs.map((doc) => ({
      _id: String(doc._id),
      errors: ["Document does not match the collection validator"],
    }));

    const invalidCount = invalidDocuments.length;
    const validCount = totalDocuments - invalidCount;

    return {
      totalDocuments,
      validCount: Math.max(0, validCount),
      invalidCount,
      invalidDocuments,
    };
  }
}

export const validationRepository = new ValidationRepository();
