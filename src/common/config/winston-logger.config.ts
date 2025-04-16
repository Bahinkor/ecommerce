import type { LoggerOptions } from "winston";

import * as winston from "winston";

export const winstonConfigOptions: LoggerOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),

    new winston.transports.File({
      filename: "logs/app.log",
      level: "info",
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),

    new winston.transports.File({
      filename: "logs/requests.log",
      level: "http",
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),

    new winston.transports.File({
      filename: "logs/errors.log",
      level: "error",
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
  ],
};
