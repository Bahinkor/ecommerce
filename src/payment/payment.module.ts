import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OrderModule } from "../order/order.module";
import { Payment } from "./entities/payment.entity";
import { PaymentController } from "./payment.controller";
import { PaymentRepository } from "./payment.repository";
import { PaymentService } from "./payment.service";

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), OrderModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
