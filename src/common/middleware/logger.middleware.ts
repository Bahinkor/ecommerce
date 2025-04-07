import type { NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";

import { Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const userAgent = req.get("user-agent") ?? "";
    const ip = req.ip;

    res.on("finish", () => {
      const { statusCode } = res;
      const contentLength = res.get("content-length");

      this.logger.log({
        level: "info",
        message: `${method} ${originalUrl} ${statusCode} ${contentLength ?? 0}ms - ${userAgent} ${ip}`,
      });
    });

    next();
  }
}
