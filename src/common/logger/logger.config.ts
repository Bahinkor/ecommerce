import { utilities as nestWinstonModuleUtilities } from "nest-winston";
import * as winston from "winston";

export const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    verbose: "cyan",
    debug: "blue",
    silly: "gray",
  },
};

winston.addColors(customLevels.colors);

export const winstonTransports = [
  new winston.transports.Console({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      nestWinstonModuleUtilities.format.nestLike("MyApp", {
        prettyPrint: true,
        colors: true,
      }),
    ),
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
];
