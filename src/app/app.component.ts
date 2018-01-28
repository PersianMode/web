import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from "@angular/material";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  hiddenGenderMenu = true;
  persistedList = false;
  searchIsFocused = false;
  selected = {
    men: false,
    women: false,
    boys: false,
    girls: false,
  };
  logos = [
    {
      brand: 'Nike',
      filename: 'nike',
      // height: 34,
      // top: 2,
      // right: 5,
      width: 60,
    },
    {
      brand: 'Converse',
      filename: 'converse',
      height: 36,
      top: 4,
      width: 77,
      right: 7,
    },
    {
      brand: 'Nike Jordan',
      filename: 'nike-jordan',
      top: 2,
      width: 88,
      right: 4,
    },
    {
      brand: 'Hurley',
      filename: 'Hurley',
      height: 45,
      top: 8,
    },
    {
      brand: 'The North Face',
      filename: 'thenorthface',
      top: 27,
      height: 84,
      width: 76,
      right: 3,
    },
    {
      brand: 'Timberland',
      filename: 'timberland',
      top: 41,
      height: 110,
      width: 110,
    },
    {
      brand: 'Polo Ralph Lauren',
      filename: 'Polo-Ralph-Lauren-Clean',
      top: 10,
      height: 50,
      width: 38,
      right: 16,
    },
    {
      brand: 'ASICS',
      filename: 'store-logo-asics',
      height: 34,
      width: 62,
      right: 5,
    },
    {
      brand: 'Adidas',
      filename: 'adidas',
      width: 45,
      right: 3,
    },
    {
      brand: 'Puma',
      filename: 'puma',
    },
    {
      brand: 'Tommy Hilfiger',
      filename: 'tommyhilfiger',
      width: 40,
      right: 4,
    },
  ];

  slides = [
    {
      imgWidth: 40,
      imgAddr: 'delivery',
      text: 'ارسال رایگان در تهران و حومه',
    },
    {
      imgWidth: 30,
      imgMarginLeft: 5,
      imgAddr: 'return',
      text: 'پس گرفتن جنس خریداری شده تا ۳۰ روز',
    },
    {
      imgWidth: 40,
      imgAddr: 'loyalty',
      text: 'تخفیف‌های ویژه و حراج‌های اختصاصی برای اعضاء',
    },
  ];

  placements = {
    menMenu: {
      headerList: [
        {
          text: 'تازه‌ها',
          href: '#',
        },
        {
          text: 'پرفروش‌ها',
          href: '#',
        },
        {
          text: 'مجموعه Equality',
          href: '#',
        },
        {
          text: 'زیر ۵۰۰ هزار تومان',
          href: '#',
        },
        {
          text: 'داره مد می‌شه',
          href: '#',
        },
        {
          text: 'مجموعه Fleece',
          href: '#',
        },
        {
          text: 'برای فصل سرما',
          href: '#',
        },
      ],
      middle: [
        [
          {
            text: 'کفش‌ها',
            href: '#',
          },
          {
            text: 'دویدن',
            href: '#',
          },
          {
            text: 'فوتبال',
            href: '#',
          },
          {
            text: 'نرمش',
            href: '#',
          },
          {
            text: 'بسکتبال',
            href: '#',
          },
        ],
        [
          {
            text: 'لباس‌ها',
            href: '#',
          },
          {
            text: 'Compression و Nike Pro',
            href: '#',
          },
          {
            text: 'پیراهن‌های Polo',
            href: '#',
          },
          {
            text: 'لباس‌های کلاه‌دار',
            href: '#',
          },
        ],
        [
          {
            text: 'لوازم جانبی',
            href: '#',
          },
          {
            text: 'کوله‌ها و کیف‌ها',
            href: '#',
          },
          {
            text: 'عینک آفتابی',
            href: '#',
          },
        ],
      ],
      leftColumn: [
        [
          {
            text: 'خرید با برند',
            href: '#',
          },
          {
            text: 'Nike',
            href: '#',
          },
          {
            text: 'Converse',
            href: '#',
          },
          {
            text: 'Hurley',
            href: '#',
          },
          {
            text: 'Nike Jordan',
            href: '#',
          },
          {
            text: 'The North Face',
            href: '#',
          },
          {
            text: 'Timberland',
            href: '#',
          },
          {
            text: 'Polo Ralph Lauren',
            href: '#',
          },
        ],
        [
          {
            text: 'خرید با ورزش',
            href: '#',
          },
          {
            text: 'دویدن',
            href: '#',
          },
          {
            text: 'فوتبال',
            href: '#',
          },
        ],
      ],
    },
    womenMenu: {},
    boysMenu: {},
    girlsMenu: {},
    fullPanels: [],
    halfPanels: [],
    quarterPanels: [],
  };

  curSlideIndex = 0;
  slider: any;
  menu = {};

  constructor(iconRegistry: MatIconRegistry) {
    //iconRegistry.setDefaultFontSetClass('fa');
  }

  ngOnInit() {
    this.slider = setInterval(() => this.curSlideIndex = (this.curSlideIndex + 1) % this.slides.length, 3000);
  }

  showList(type) {
    setTimeout(() => {
      this.hiddenGenderMenu = false;
      this.selected[type] = true;
      this.menu = this.placements[type + 'Menu'];
    }, 100);
  }

  persistList() {
    this.persistedList = true;
  }

  hideList() {
    this.hiddenGenderMenu = true;
    this.persistedList = false;
    for (const i in this.selected) {
      if (this.selected.hasOwnProperty(i)) {
        this.selected[i] = false;
      }
    }
  }

  countDownHideList() {

    setTimeout(() => {
      if (!this.persistedList) {
        this.hideList(0);
      }
    }, 100);
  }

  searchFocused() {
    this.searchIsFocused = true;
  }

  searchUnfocused() {
    this.searchIsFocused = false;
  }

  nextSlide() {
    this.curSlideIndex++;
  }

  prevSlide() {
    this.curSlideIndex--;
  }
}
