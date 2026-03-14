import { ObjectId, type Sort } from "mongodb";
import { BaseRepository } from "../base.repository";
import type {
  AddDocumentInput,
  DeleteDocumentInput,
  DocumentRecord,
  FilterDocumentsInput,
  GetDocumentsInput,
  PaginatedResult,
  QueryDocumentsInput,
  UpdateDocumentInput,
} from "@compooss/types";

export class DocumentRepository extends BaseRepository {
  private async getCollection(databaseName: string, collectionName: string) {
    const db = await this.db(databaseName);
    return db.collection<DocumentRecord>(collectionName);
  }

  private buildPaginatedResult<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
  ): PaginatedResult<T> {
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  /**
   * Returns all documents in a collection — paginated.
   */
  async getDocuments(
    input: GetDocumentsInput
  ): Promise<PaginatedResult<DocumentRecord>> {
    const { databaseName, collectionName, pagination } = input;
    const { page, limit } = pagination;

    const col = await this.getCollection(databaseName, collectionName);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      col.find({}).skip(skip).limit(limit).toArray(),
      col.countDocuments({}),
    ]);

    return this.buildPaginatedResult(data, total, page, limit);
  }

  /**
   * Filters documents by a MongoDB query — paginated.
   *
   * @example
   * filterDocuments({ filter: { status: "active", age: { $gt: 18 } }, ... })
   */
  async filterDocuments(
    input: FilterDocumentsInput
  ): Promise<PaginatedResult<DocumentRecord>> {
    const { databaseName, collectionName, filter, pagination } = input;
    const { page, limit } = pagination;

    const col = await this.getCollection(databaseName, collectionName);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      col.find(filter).skip(skip).limit(limit).toArray(),
      col.countDocuments(filter),
    ]);

    return this.buildPaginatedResult(data, total, page, limit);
  }

  /**
   * Query documents with filter, sort, project, skip and limit.
   */
  async queryDocuments(
    input: QueryDocumentsInput
  ): Promise<PaginatedResult<DocumentRecord>> {
    const { databaseName, collectionName, filter, sort = {}, project, skip, limit } = input;

    const col = await this.getCollection(databaseName, collectionName);
    let cursor = col.find(filter).skip(skip).limit(limit);

    if (Object.keys(sort).length > 0) {
      cursor = cursor.sort(sort as Sort);
    }
    if (project && Object.keys(project).length > 0) {
      cursor = cursor.project(project);
    }

    const [data, total] = await Promise.all([
      cursor.toArray(),
      col.countDocuments(filter),
    ]);

    const page = limit > 0 ? Math.floor(skip / limit) + 1 : 1;
    return this.buildPaginatedResult(data, total, page, limit);
  }

  /**
   * Inserts a new document into the collection.
   * If the document omits _id, MongoDB auto-generates one.
   * Returns the inserted document with _id set to the one used by MongoDB.
   */
  async addDocument(input: AddDocumentInput): Promise<DocumentRecord> {
    const { databaseName, collectionName, document } = input;
    const col = await this.getCollection(databaseName, collectionName);

    const result = await col.insertOne(document);

    return { ...document, _id: result.insertedId } as DocumentRecord;
  }

  /**
   * Updates fields on a document using $set.
   * Returns the updated document.
   */
  async updateDocument(
    input: UpdateDocumentInput
  ): Promise<DocumentRecord | null> {
    const { databaseName, collectionName, documentId, payload } = input;
    const col = await this.getCollection(databaseName, collectionName);

    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(documentId) },
      { $set: payload },
      { returnDocument: "after" }
    );

    return result ?? null;
  }

  /**
   * Deletes a single document by its ObjectId.
   */
  async deleteDocument(input: DeleteDocumentInput): Promise<boolean> {
    const { databaseName, collectionName, documentId } = input;
    const col = await this.getCollection(databaseName, collectionName);

    const result = await col.deleteOne({ _id: new ObjectId(documentId) });
    return result.deletedCount === 1;
  }
}

export const documentRepository = new DocumentRepository();