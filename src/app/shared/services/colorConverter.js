const color = require('css-color-converter');
const colorConverter = function(col) {
  return color(col.toLowerCase()).toHexString();
};
const safeColorConverter = function(col) {
  if (col) {
  let words = col.split(' ');
  for (let i =0; i < words.length; i ++ ) {
    try {
        let cc = colorConverter(words[i]);
        return cc;
      }  catch (e) {}
    }
  }
  return null;
};
module.exports = {
  colorConverter,
  safeColorConverter,
};
