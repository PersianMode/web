const freeSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', 'MISC'];
export const sizeSorter = (a, b) => {
  let av = a, bv = b;
  if (a.value) {
    av = a.value;
  }

  if (b.value) {
    bv = b.value;
  }

  const ai = freeSizes.indexOf(('' + av).toUpperCase());
  const bi = freeSizes.indexOf(('' + bv).toUpperCase());
  if (ai !== -1 && bi !== -1) {
    return ai - bi;
  } else if (ai !== -1 ) {
    return 1;
  } else if (bi !== -1) {
    return -1;
  } else if (+av && + bv) {
    return av - bv;
  } else return '' + av < '' + bv ? -1 : 1;
};
