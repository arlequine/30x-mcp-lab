import { randomUUID } from "node:crypto";
import { calcFee, type PaymentMethod } from "./fees.js";

export interface Payment {
  id: string;
  amount: number;
  currency: "MXN";
  method: PaymentMethod;
  fee: number;
  refunded: number;
  createdAt: string;
}

const payments = new Map<string, Payment>();

export function createPayment(amount: number, method: PaymentMethod): Payment {
  const payment: Payment = {
    id: `pay_${randomUUID().slice(0, 8)}`,
    amount,
    currency: "MXN",
    method,
    fee: calcFee(amount, method),
    refunded: 0,
    createdAt: new Date().toISOString(),
  };
  payments.set(payment.id, payment);
  return payment;
}

export function getPayment(id: string): Payment | undefined {
  return payments.get(id);
}
