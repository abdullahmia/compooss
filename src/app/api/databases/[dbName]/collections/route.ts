import { collectionRepository } from "@/lib/core-modules/collection/collection.repository";
import { createApiResponse } from "@/lib/utils/api-response.util";
import { NextResponse, type NextRequest } from "next/server";

interface DbParamProps {
  params: {
    dbName?: string;
  };
}

export async function GET(req: NextRequest, { params }: DbParamProps) {
  const {dbName} = await params;
  if (!dbName) {
    return NextResponse.json(
      createApiResponse(null, "Missing dbName parameter", 400),
      { status: 400 },
    );
  }

  const collections = await collectionRepository.getCollections(dbName);
  return NextResponse.json(
    createApiResponse(collections, "Collections fetched successfully", 200),
  );
}

export async function POST(req: NextRequest, { params }: DbParamProps) {
  const {dbName} = await params;
  if (!dbName) {
    return NextResponse.json(
      createApiResponse(null, "Missing dbName parameter", 400),
      { status: 400 },
    );
  }

  const { collectionName } = await req.json();
  const collection = await collectionRepository.createCollection({
    databaseName: dbName,
    collectionName,
  });
  return NextResponse.json(
    createApiResponse(collection, "Collection created successfully", 201),
  );
}
