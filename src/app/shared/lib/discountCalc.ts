const ROUNDING_FACTOR = 500;

export function discountCalc(price, discount) {
  if (discount < 100)
    return Math.round(price * (100 - discount) / (100 * ROUNDING_FACTOR)) * ROUNDING_FACTOR;
  else
    return Math.round((price - discount) / ROUNDING_FACTOR) * ROUNDING_FACTOR;

}

export function getDiscounted(price, discount) {
  if (discount < 100)
    return Math.round(price * discount / (100 * ROUNDING_FACTOR)) * ROUNDING_FACTOR;
  else
    return Math.round(discount / ROUNDING_FACTOR) * ROUNDING_FACTOR;

}
