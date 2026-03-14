import { documentRepository } from "@/lib/core-modules/document/document.repository";
import { createApiResponse } from "@/lib/utils/api-response.util";
import { NextResponse } from "next/server";

type DocMutationParams = {
  params: Promise<{ dbName: string; colName: string; docId: string }>;
};


export async function PATCH(req: Request, { params }: DocMutationParams) {
  try {
    const { dbName, colName, docId } = await params;
    const payload = await req.json();
 
    if (!payload || typeof payload !== "object" || Object.keys(payload).length === 0) {
      return NextResponse.json(
        { message: "A non-empty update object is required" },
        { status: 400 }
      );
    }
 
    const updated = await documentRepository.updateDocument({
      databaseName: dbName,
      collectionName: colName,
      documentId: docId,
      payload,
    });
 
    if (!updated) {
      return NextResponse.json(
        { message: `Document "${docId}" not found` },
        { status: 404 }
      );
    }
    return NextResponse.json(createApiResponse(updated, "Document updated successfully", 200));
  } catch (error) {
    return NextResponse.json({ message: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: DocMutationParams) {
  try {
    const { dbName, colName, docId } = await params;
 
    const deleted = await documentRepository.deleteDocument({
      databaseName: dbName,
      collectionName: colName,
      documentId: docId,
    });
 
    if (!deleted) {
      return NextResponse.json(
        { message: `Document "${docId}" not found` },
        { status: 404 }
      );
    }
 
    return NextResponse.json(
      createApiResponse(deleted, "Document deleted successfully", 200),
    );
  } catch (error) {
    return NextResponse.json(createApiResponse(null, String(error), 500));
  }
}