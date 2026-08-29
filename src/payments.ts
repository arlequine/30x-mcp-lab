import { randomUUID } from "node:crypto";
import { ValidationError } from "./errors.js";
import { calcFee, type PaymentMethod } from "./fees.js";
import { charge } from "./psp/client.js";

export interface Payment {
  id: string;
  amount: number;
  currency: "MXN";
  method: PaymentMethod;
  fee: number;
  refunded: number;
  pspReference: string;
  createdAt: string;
}

const payments = new Map<string, Payment>();

export async function createPayment(amount: number, method: PaymentMethod): Promise<Payment> {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new ValidationError("amount debe ser un número mayor a 0");
  }
  const result = await charge(amount, method);
  if (result.status !== "approved") {
    throw new ValidationError("El PSP rechazó el cargo");
  }
  const payment: Payment = {
    id: `pay_${randomUUID().slice(0, 8)}`,
    amount,
    currency: "MXN",
    method,
    fee: calcFee(amount, method),
    refunded: 0,
    pspReference: result.pspReference,
    createdAt: new Date().toISOString(),
  };
  payments.set(payment.id, payment);
  return payment;
}

export function getPayment(id: string): Payment | undefined {
  return payments.get(id);
}

export function listPayments(): Payment[] {
  return [...payments.values()];
}
