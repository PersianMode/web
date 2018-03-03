import {Component, OnInit} from '@angular/core';
import {filter_optionsEnum} from '../../enum/filter_options.enum';

@Component({
  selector: 'app-filtering-panel',
  templateUrl: './filtering-panel.component.html',
  styleUrls: ['./filtering-panel.component.css']
})
export class FilteringPanelComponent implements OnInit {
  collection_data = {
    collectionNameFa: 'تازه‌های مردانه',
    collectionName: 'men-shoes',
    set: [
      {
        name: 'نایک Sportswear',
        colors: [
          {
            url: '07.jpg',
            position: 0,
            pi_id: 0,
          },
          {
            url: '07.jpg',
            position: 1,
            pi_id: 0,
          },
          {
            url: '07.jpg',
            position: 2,
            pi_id: 0,
          },
        ],
        size : ['4', '5', '6'],
        brand : 'nike',
        type : 'لباس',
        tags: ['جکت', 'مردانه'],
        price: 899900,
      },
      {
        name: 'نایک Sportswear Tech Shield',
        colors: [
          {
            url: '08.jpg',
            position: 0,
            pi_id: 0,
          },
          {
            url: '08.jpg',
            position: 1,
            pi_id: 0,
          },
          {
            url: '08.jpg',
            position: 2,
            pi_id: 0,
          },
        ],
        size : ['4', '6', '7'],
        brand : 'nike',
        type : 'لباس',
        tags: ['جکت', 'مردانه'],
        price: 1399900,
      },
      {
        name: 'نایک مدل Kobe A.D. Black Mamba',
        colors: [
          {
            url: '13.jpeg',
            position: 0,
            pi_id: 0,
          },
        ],
        size : ['4.5', '5', '6'],
        brand : 'addidas',
        type : 'کفش',
        tags: ['کفش', 'مردانه', 'بسکتبال'],
        price: 999900,
      },
    ]
  };
  items = [];
  filter_options = [];
  filter_options_fa = [];
  exist_types = [];
  exist_brands = [];
  exist_colors = [];
  exist_sizes = [];
constructor() {
  }

  ngOnInit() {
    for (let i = 0; i < 20; i++)
      this.items.push(i + 1);
    this.filter_options = Object.keys(this.collection_data.set[0]);
    this.filter_options.forEach(el => {
      if (el === "colors")
        this.filter_options_fa.push("رنگ");
      else if (el === "size")
        this.filter_options_fa.push("سایز");
      else if (el === "brand")
        this.filter_options_fa.push("برند");
      else if (el === "type")
        this.filter_options_fa.push("نوع");
      else if (el === "tags")
        this.filter_options_fa.push("تگ");
      else if (el === "price")
        this.filter_options_fa.push("قیمت");
    });
    this.getTypes();
    this.getBrands();
  }
  getTypes() {
  this.exist_types = [];
    this.collection_data.set.forEach(el => {
      if (this.exist_types.findIndex(i => i === el.type) === -1)
        this.exist_types.push(el.type);
    });
    console.log('==>', this.exist_types);
  }

  getBrands() {
    this.exist_brands = [];
    this.collection_data.set.forEach(el => {
      if (this.exist_brands.findIndex(i => i === el.brand) === -1)
        this.exist_brands.push(el.brand);
    });
    console.log('==>', this.exist_brands);
  }
}
