import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Order } from "../order/entities/order.entity";
import { Payment } from "./entities/payment.entity";

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(trackId: number, order: Order): Promise<Payment> {
    const paymentPortalUrl = `https://gateway.zibal.ir/start/${trackId}`;
    const payment = this.paymentRepository.create({ trackId, order, paymentPortalUrl });
    return this.paymentRepository.save(payment);
  }

  async findOneByTrackId(trackId: number): Promise<Payment | null> {
    return this.paymentRepository.findOne({ where: { trackId }, relations: ["order"] });
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({ relations: ["order"] });
  }

  async save(payment: Payment): Promise<Payment> {
    return this.paymentRepository.save(payment);
  }
}
