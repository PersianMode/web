const ROUNDING_FACTOR = 500;
export function discountCalc(price, discount) {
  return Math.round(price * (100 - discount) / (100 * ROUNDING_FACTOR)) * ROUNDING_FACTOR;
}
