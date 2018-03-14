export function priceFormatter(p) {
  return (+p).toLocaleString('fa', {useGrouping: true});
}
