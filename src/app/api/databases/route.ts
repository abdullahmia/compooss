import { databaseRepository } from "@/lib/core-modules/database/database.repository";
import { createApiResponse } from "@/lib/utils/api-response.util";
import { NextResponse } from "next/server";

export async function GET() {
  const databases = await databaseRepository.getAllDatabases();
  return NextResponse.json(createApiResponse(databases, "Databases fetched successfully", 200));
}

export async function POST(req: Request) {
  const { dbName, collectionName } = await req.json();
  try {
    const created = await databaseRepository.createDatabase({
      databaseName: dbName,
      initialCollection: collectionName,
    });
    return NextResponse.json(createApiResponse(created, "Database created successfully", 201));
  } catch (error) {
    return NextResponse.json(createApiResponse(null, String(error), 500));
  }
}