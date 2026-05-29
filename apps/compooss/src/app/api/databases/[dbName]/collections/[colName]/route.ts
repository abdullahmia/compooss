import { isProtectedDatabase } from "@compooss/types";
import { collectionRepository } from "@/lib/core-modules/collection/collection.repository";
import { withLogging } from "@/lib/logger";
import { createApiResponse } from "@/lib/utils/api-response.util";
import { NextResponse } from "next/server";

type ColParams = { params: Promise<{ dbName: string; colName: string }> };

export const DELETE = withLogging(async (_req, ctx) => {
  try {
    const { dbName, colName } = await (ctx as ColParams).params;
    if (isProtectedDatabase(dbName)) {
      return NextResponse.json(
        createApiResponse(null, "Access to system databases (admin, local, config) is not allowed.", 403),
        { status: 403 },
      );
    }

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
}, "/api/databases/[dbName]/collections/[colName]");
