import { collectionRepository } from "@/lib/core-modules/collection/collection.repository";
import { createApiResponse } from "@/lib/utils/api-response.util";
import { NextResponse } from "next/server";

type ColParams = { params: Promise<{ dbName: string; colName: string }> };
 
export async function DELETE(_req: Request, { params }: ColParams) {
  try {
    const { dbName, colName } = await params;
 
    const dropped = await collectionRepository.deleteCollection({
      databaseName: dbName,
      collectionName: colName,
    });
 
    if (!dropped) {
      return NextResponse.json(createApiResponse(null, `Collection "${colName}" not found`, 404));
    }
 
    return NextResponse.json(createApiResponse(dropped, `Collection "${colName}" deleted successfully`, 200));
  } catch (error) {
    return NextResponse.json(createApiResponse(null, String(error), 500));
  }
}