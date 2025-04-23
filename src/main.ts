import type { NestExpressApplication } from "@nestjs/platform-express";

import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import { WinstonModule } from "nest-winston";

import { AppModule } from "./app.module";
import { swaggerConfig } from "./common/config/swagger.config";
import { customLevels, winstonTransports } from "./common/logger/logger.config";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      levels: customLevels.levels,
      transports: winstonTransports,
    }),
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();
  app.setGlobalPrefix("api");
  app.enableVersioning({ type: VersioningType.URI });
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
