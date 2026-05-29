import { isProtectedDatabase, type JsonExportMode } from "@compooss/types";
import { exportRepository, documentsToCsv, documentsToJson } from "@/lib/core-modules/export/export.repository";
import { withLogging } from "@/lib/logger";
import { createApiResponse } from "@/lib/utils/api-response.util";
import { extractErrorMessage, protectedDbResponse } from "@/lib/utils/api-route.util";
import { NextResponse, type NextRequest } from "next/server";

type Params = { params: Promise<{ dbName: string; colName: string }> };

export const GET = withLogging(async (req, ctx) => {
  try {
    const { dbName, colName } = await (ctx as Params).params;

    if (isProtectedDatabase(dbName)) return protectedDbResponse();

    const sp = (req as NextRequest).nextUrl.searchParams;
    const format = sp.get("format") === "csv" ? "csv" : "json";
    const limit = Math.max(0, Number(sp.get("limit") ?? 0));
    const jsonModeRaw = sp.get("jsonMode");
    const jsonMode: JsonExportMode =
      jsonModeRaw === "relaxed" || jsonModeRaw === "canonical" ? jsonModeRaw : "default";

    let filter: Record<string, unknown> = {};
    const filterRaw = sp.get("filter");
    if (filterRaw && filterRaw.trim() !== "" && filterRaw.trim() !== "{}") {
      try {
        filter = JSON.parse(filterRaw) as Record<string, unknown>;
      } catch {
        // ignore invalid filter — export all
      }
    }

    const docs = await exportRepository.fetchForExport(dbName, colName, filter, limit);

    const filename = `${colName}-export.${format}`;

    if (format === "csv") {
      const csv = documentsToCsv(docs);
      return new Response(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    const json = documentsToJson(docs, jsonMode);
    return new Response(json, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      createApiResponse(null, extractErrorMessage(error), 500),
      { status: 500 },
    );
  }
}, "/api/databases/[dbName]/collections/[colName]/export");
