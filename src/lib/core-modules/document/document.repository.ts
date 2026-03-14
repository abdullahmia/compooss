import { ObjectId } from "mongodb";
import { BaseRepository } from "../base.repository";
import { DocumentRecord, IAddDocumentInput, IDeleteDocumentInput, IFilterDocumentsInput, IGetDocumentsInput, IPaginatedResult, IUpdateDocumentInput } from "../repository.types";

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
  ): IPaginatedResult<T> {
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
    input: IGetDocumentsInput
  ): Promise<IPaginatedResult<DocumentRecord>> {
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
    input: IFilterDocumentsInput
  ): Promise<IPaginatedResult<DocumentRecord>> {
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
   * Inserts a new document into the collection.
   * If the document omits _id, MongoDB auto-generates one.
   * Returns the inserted document with _id set to the one used by MongoDB.
   */
  async addDocument(input: IAddDocumentInput): Promise<DocumentRecord> {
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
    input: IUpdateDocumentInput
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
  async deleteDocument(input: IDeleteDocumentInput): Promise<boolean> {
    const { databaseName, collectionName, documentId } = input;
    const col = await this.getCollection(databaseName, collectionName);

    const result = await col.deleteOne({ _id: new ObjectId(documentId) });
    return result.deletedCount === 1;
  }
}

export const documentRepository = new DocumentRepository();