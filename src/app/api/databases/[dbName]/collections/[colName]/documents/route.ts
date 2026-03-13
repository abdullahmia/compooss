import { documentRepository } from "@/lib/core-modules/document/document.repository";
import { createApiResponse } from "@/lib/utils/api-response.util";
import { NextResponse } from "next/server";

type DocParams = { params: Promise<{ dbName: string; colName: string }> };

export async function GET(req: Request, { params }: DocParams) {
  const { dbName, colName } = await params;
  const { searchParams } = new URL(req.url);
 
  const result = await documentRepository.getDocuments({
    databaseName: dbName,
    collectionName: colName,
    pagination: {
      page: Number(searchParams.get("page") ?? 1),
      limit: Number(searchParams.get("limit") ?? 20),
    },
  });
 
  return NextResponse.json(createApiResponse(result, "Documents fetched successfully", 200));
}

export async function POST(req: Request, { params }: DocParams) {
  const { dbName, colName } = await params;
  const { document } = await req.json();
  const inserted = await documentRepository.addDocument({
    databaseName: dbName,
    collectionName: colName,
    document,
  });
  return NextResponse.json(createApiResponse(inserted, "Document inserted successfully", 201));
}
