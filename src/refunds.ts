import { ConflictError, NotFoundError } from "./errors.js";
import { getPayment, type Payment } from "./payments.js";

/** Reembolsa el cargo completo. Un cargo sólo se puede reembolsar una vez. */
export function refund(paymentId: string): Payment {
  const payment = getPayment(paymentId);
  if (!payment) throw new NotFoundError(`No existe el cargo ${paymentId}`);
  if (payment.refunded > 0) throw new ConflictError("El cargo ya fue reembolsado");
  payment.refunded = payment.amount;
  return payment;
}
