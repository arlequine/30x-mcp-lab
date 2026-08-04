export type PaymentMethod = "card" | "spei" | "oxxo";

/** Comisión porcentual por método de pago. */
const RATES: Record<PaymentMethod, number> = {
  card: 0.029,
  spei: 0.005,
  oxxo: 0.035,
};

/** Comisión fija en MXN por transacción. */
const FIXED_FEE_MXN: Record<PaymentMethod, number> = {
  card: 3,
  spei: 0,
  oxxo: 10,
};

export function calcFee(amount: number, method: PaymentMethod): number {
  return amount * RATES[method] + FIXED_FEE_MXN[method];
}
