import { schemaRepository } from "@/lib/core-modules/schema/schema.repository";
import { createApiResponse } from "@/lib/utils/api-response.util";
import { NextResponse } from "next/server";

type SchemaParams = { params: Promise<{ dbName: string; colName: string }> };

export async function POST(req: Request, { params }: SchemaParams) {
  try {
    const { dbName, colName } = await params;
    const body = (await req.json().catch(() => ({}))) as { sampleSize?: number };
    const sampleSize = typeof body?.sampleSize === "number" ? body.sampleSize : undefined;

    const result = await schemaRepository.analyzeSchema({
      databaseName: dbName,
      collectionName: colName,
      sampleSize,
    });

    return NextResponse.json(
      createApiResponse(result, "Schema analysis completed", 200),
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      createApiResponse(null, String(error), 500),
      { status: 500 },
    );
  }
}
