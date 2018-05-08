export function productColorMap(r) {
  return r.colors.map(c => c.name ? c.name.split('/')
      .map(n => n.split('-'))
      .reduce((x, y) => x.concat(y), [])
      .map(n => n.replace(/[()]/g, ''))
    : []);
}
