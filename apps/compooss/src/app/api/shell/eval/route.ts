import { evaluateShellCommand } from "@/lib/core-modules/shell/shell.evaluator";
import { withLogging } from "@/lib/logger";
import { serverLogger } from "@/lib/logger/logger.server";
import { createApiResponse } from "@/lib/utils/api-response.util";
import { NextResponse } from "next/server";

const log = serverLogger.child({ module: "shell" });

export const POST = withLogging(async (req) => {
  const body = (await req.json()) as {
    command?: string;
    database?: string;
  };

  const command = body.command?.trim() ?? "";
  const database = body.database?.trim() || "test";

  if (!command) {
    return NextResponse.json(
      createApiResponse(null, "command is required.", 400),
      { status: 400 },
    );
  }

  // Log metadata only — never the command source (may contain credentials or PII).
  log.debug("shell eval", { database, commandLength: command.length });

  try {
    const response = await evaluateShellCommand(command, { database });

    return NextResponse.json(
      createApiResponse(response, "OK", 200),
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);
    log.error("shell eval failed", { database, commandLength: command.length, errMsg: message });
    return NextResponse.json(
      createApiResponse(null, message, 500),
      { status: 500 },
    );
  }
}, "/api/shell/eval");
