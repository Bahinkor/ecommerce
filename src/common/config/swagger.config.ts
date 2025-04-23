import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
  .setTitle("Ecommerce API")
  .setDescription(
    "Back-end application developed with Nest JS technology and MySQL database. (online shop restful api)",
  )
  .setVersion("1.0")
  .addTag("ecommerce")
  .build();
