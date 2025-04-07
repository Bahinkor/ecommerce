import type { NestExpressApplication } from "@nestjs/platform-express";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();
  app.setGlobalPrefix("api");
  app.enableVersioning();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
