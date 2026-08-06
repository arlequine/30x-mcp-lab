import { test } from "node:test";
import assert from "node:assert/strict";
import { calcFee } from "../src/fees.js";

test("tarjeta: 2.9% + 3 MXN", () => {
  assert.ok(Math.abs(calcFee(100, "card") - 5.9) < 1e-9);
});

test("SPEI: 0.5% sin comisión fija", () => {
  assert.ok(Math.abs(calcFee(1000, "spei") - 5) < 1e-9);
});

test("OXXO: 3.5% + 10 MXN", () => {
  assert.ok(Math.abs(calcFee(200, "oxxo") - 17) < 1e-9);
});
