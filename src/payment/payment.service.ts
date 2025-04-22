import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { Order } from "../order/entities/order.entity";
import { OrderStatusEnum } from "../order/enums/order-status.enum";
import { OrderRepository } from "../order/order.repository";
import { OrderService } from "../order/order.service";
import { Payment } from "./entities/payment.entity";
import { PaymentRepository } from "./payment.repository";
import { PaymentStatus } from "./types/payment-status.enum";
import {
  ZibalCreatePaymentResponse,
  ZobalVerifyPaymentResponse,
} from "./types/zibal-response.type";
import { createPaymentPortal, verifyPayment } from "./utils/payment.request";

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly orderService: OrderService,
    private readonly orderRepository: OrderRepository,
  ) {}

  async create(orderId: number, userId: number): Promise<Payment> {
    const order: Order = await this.orderService.findOneByIdAndUserId(orderId, userId);
    const payment: ZibalCreatePaymentResponse = await createPaymentPortal(order.totalPrice);
    return this.paymentRepository.create(payment.trackId, order);
  }

  async verify(trackId: number): Promise<Payment> {
    const payment: ZobalVerifyPaymentResponse = await verifyPayment(trackId);
    if (payment.result !== 100) throw new BadRequestException("Payment failed or not found");
    const paymentEntity: Payment = await this.findOneByTrackId(trackId);
    paymentEntity.status = PaymentStatus.SUCCESS;
    const payedPaymentEntity = await this.paymentRepository.save(paymentEntity);

    const order: Order | null = await this.orderRepository.findOne(paymentEntity.order.id);
    if (!order) throw new NotFoundException(`Order id ${paymentEntity.order.id} not found`);
    order.status = OrderStatusEnum.COMPLETED;
    await this.orderRepository.save(order);

    return payedPaymentEntity;
  }

  async findOneByTrackId(trackId: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOneByTrackId(trackId);
    if (!payment) throw new NotFoundException(`Payment id ${trackId} not found`);
    return payment;
  }

  findAll(): Promise<Payment[]> {
    return this.paymentRepository.findAll();
  }
}
