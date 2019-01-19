const color = require('css-color-converter');
const colorNameList = require('color-name-list');
const colorConverter = function (col) {
  return color(col.toLowerCase()).toHexString();
};
const safeColorConverter = function (col) {
  if (col) {
    const words = col.split(' ').map(a => a.split('-')).reduce((x , y) => x.concat(y)).map(a => a.split('/')).reduce((x , y) => x.concat(y));
    for (let i = 0; i < words.length; i++) {
      try {
        const cc = colorConverter(words[i]);
        return cc;
      } catch (e) {}
    }
    const cc = colorNameList.find(r => col.toLowerCase() === r.name.toLowerCase());
    if (cc)
      return cc.hex;
  }
  return null;
};
module.exports = {
  colorConverter,
  safeColorConverter,
};
