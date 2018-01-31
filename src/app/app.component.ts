import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
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
  topMenu = [
    {
      collectionName: 'men',
      collectionNameFa: 'مردانه',
      collectionRoute: '#',
    },
    {
      collectionName: 'women',
      collectionNameFa: 'زنانه',
      collectionRoute: '#',
    },
    {
      collectionName: 'girls',
      collectionNameFa: 'دخترانه',
      collectionRoute: '#',
    },
    {
      collectionName: 'boys',
      collectionNameFa: 'پسرانه',
      collectionRoute: '#',
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
            text: 'دو',
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
          {
            text: 'لوازم جانبی',
            href: '#',
            isHeader: true,
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
            text: 'با برند',
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
            text: 'با ورزش',
            href: '#',
          },
          {
            text: 'دو',
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
    panels: [
      {
        imgUrl: 'assets/pictures/pw-1.png',
        href: '#',
        areas : [
          {
            pos: 'left-center',
            title: 'متفاوت باش!',
            text: 'حرکت رو به جلو ...',
          },
        ],
        type: 'full',
      },
      {
        imgUrl: 'assets/pictures/pw-2.png',
        href: '#',
        areas : [
          {
            pos : 'right-center',
            title: 'مثل همیشه، فراتر از زمان!',
            text: 'معرفی محصولات جدید نایک پلاس',
            color: 'black',
          },
        ],
        type: 'full',
      },
      {
        imgUrl: 'assets/pictures/pw-7.png',
        href: '#',
        areas : [
          {
            pos: 'left-center',
            title: 'خاکستری بی نظیر!',
            text: 'برای اولین بار',
          },
        ],
        type: 'full',
      },
      {
        imgUrl: 'assets/pictures/pw-4.png',
        href: '#',
        areas : [
          {
            pos: 'left-center',
            title: 'کاملا گرم',
            text: 'محصولات ابریشمی مناسب زمستان',
          },
          {
            pos : 'right-center',
            title: 'زمان درخشیدن توست!',
            text: 'نایک، حامی تیم ملی در طول بازیها',
          },
        ],
        type: 'full',
      },
      {
        imgUrl: 'assets/pictures/pw-5.png',
        href: '#',
        areas : [
          {
            pos: 'right-top',
            title: '',
            text: 'رنگهای جدید، دلخواه شما',
            color: 'black',
          },
        ],
        type: 'full',
      }
    ],

    footer: {
      headerList: [
        {
          text: 'کارت های هدیه',
          href: '#',
        },
        {
          text: 'تخفیف های دانش آموزی',
          href: '#',
        },
        {
          text: 'تخفیف های دانشجویی',
          href: '#',
        },
        {
          text: 'آدرس شعبه ها',
          href: '#',
        },
        {
          text: 'عضو شوید',
          href: '#',
        },
        {
          text: 'فیدبک های اعضا',
          href: '#',
        },
      ],
      middle: [
        {
          header: true,
          text: 'سوالات متداول',
          href: '#',
        },
        {
          header: false,
          text: 'وضعیت سفارش',
          href: '#',
        },
        {
          header: false,
          text: 'خرید و دریافت',
          href: '#',
        },
        {
          header: false,
          text: 'بازگردادندن کالا',
          href: '#',
        },
        {
          header: false,
          text: 'آپشن های پرداخت',
          href: '#',
        },
        {
          header: false,
          text: 'تماس با ما',
          href: '#',
        },
      ],
      leftColumn: [
        {
          header: true,
          text: 'درباره پرشین مد',
          href: '#',
        },
        {
          header: false,
          text: 'اخبار',
          href: '#',
        },
        {
          header: false,
          text: 'حرفه ای ها',
          href: '#',
        },
        {
          header: false,
          text: 'گفتگو',
          href: '#',
        },
        {
          header: false,
          text: 'اسپانسرها',
          href: '#',
        },
        {
          header: false,
          text: 'ایده های نو',
          href: '#',
        },
      ],
    }
  };

  curSlideIndex = 0;
  slider: any;
  menu = {};

  constructor(iconRegistry: MatIconRegistry) {
  }

  ngOnInit() {
    this.initSlider();
  }

  initSlider() {
    clearInterval(this.slider);
    this.slider = setInterval(() => this.curSlideIndex = (this.curSlideIndex + 1) % this.slides.length, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.slider);
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
        this.hideList();
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
    this.initSlider();
  }

  prevSlide() {
    this.curSlideIndex--;
    this.initSlider();
  }
}
