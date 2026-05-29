import { NextResponse } from "next/server";
import { createApiResponse } from "@/lib/utils/api-response.util";
import { serverLogger } from "./logger.server";

type RouteHandler = (req: Request, ctx: unknown) => Promise<NextResponse | Response>;

export const withLogging = (handler: RouteHandler, route: string): RouteHandler => {
  return async (req: Request, ctx: unknown): Promise<NextResponse | Response> => {
    const requestId = crypto.randomUUID().slice(0, 8);
    const method = req.method;
    const start = Date.now();
    const log = serverLogger.child({ module: "api", requestId, route, method });

    log.debug("request started");

    try {
      const response = await handler(req, ctx);
      const durationMs = Date.now() - start;
      const status = response.status;

      if (status >= 500) {
        log.error("request failed", { status, durationMs });
      } else if (status >= 400) {
        log.warn("request rejected", { status, durationMs });
      } else {
        log.info("request completed", { status, durationMs });
      }

      const next = new NextResponse(response.body, response);
      next.headers.set("X-Request-Id", requestId);
      return next;
    } catch (err) {
      const durationMs = Date.now() - start;
      log.error("unhandled route error", {
        durationMs,
        err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : String(err),
      });
      const res = NextResponse.json(
        createApiResponse(null, "An unexpected error occurred.", 500),
        { status: 500 },
      );
      res.headers.set("X-Request-Id", requestId);
      return res;
    }
  };
}
