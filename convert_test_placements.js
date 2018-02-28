const json = require('./src/assets/test_input_for_menu.json');

let arr = [];
for(let key in json) {
  arr.push({
    address: key,
    is_app: false,
    placement: json[key].placements,
    page_info: {}
  })
}

console.log(JSON.stringify(arr,null,2));
