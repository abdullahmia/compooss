import { databaseRepository } from "@/lib/core-modules/database/database.repository";
import { withLogging } from "@/lib/logger";
import { createApiResponse } from "@/lib/utils/api-response.util";
import { NextResponse } from "next/server";

export const GET = withLogging(async () => {
  try {
    const databases = await databaseRepository.getAllDatabases();
    return NextResponse.json(createApiResponse(databases, "Databases fetched successfully", 200));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      createApiResponse(null, `Connection failed: ${message}`, 503),
      { status: 503 },
    );
  }
}, "/api/databases");

export const POST = withLogging(async (req) => {
  const { dbName, collectionName } = await req.json();
  try {
    const created = await databaseRepository.createDatabase({
      databaseName: dbName,
      initialCollection: collectionName,
    });
    return NextResponse.json(createApiResponse(created, "Database created successfully", 201));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const isProhibited = message.toLowerCase().includes("prohibited");
    if (isProhibited) {
      return NextResponse.json(createApiResponse(null, message, 403), { status: 403 });
    }
    return NextResponse.json(createApiResponse(null, message, 500), { status: 500 });
  }
}, "/api/databases");
