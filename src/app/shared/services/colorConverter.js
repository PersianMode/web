const color = require('css-color-converter');
const colorConverter = function(col) {
  return color(col.toLowerCase()).toHexString();
};

module.exports = {
  colorConverter: colorConverter
};
