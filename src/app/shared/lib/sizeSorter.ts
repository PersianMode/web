const freeSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', 'MISC'];
export const sizeSorter = (a, b) => {
  const ai = freeSizes.indexOf(('' + a).toUpperCase());
  const bi = freeSizes.indexOf(('' + b).toUpperCase());
  if (ai !== -1 && bi !== -1) {
    return ai - bi;
  } else if (ai !== -1 ) {
    return 1;
  } else if (bi !== -1) {
    return -1;
  } else if (+a && + b) {
    return a - b;
  } else return '' + a < '' + b ? -1 : 1;
};
