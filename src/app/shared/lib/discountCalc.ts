const ROUNDING_FACTOR = 500;
export function discountCalc(price, discount) {
  return Math.round(price * (1 - discount) / ROUNDING_FACTOR) * ROUNDING_FACTOR;
}
