import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {


  footer = {
    headerList: [
      {
        text: 'کارت‌های هدیه',
        href: '#',
      },
      {
        text: 'تخفیف‌های دانش آموزی',
        href: '#',
      },
      {
        text: 'تخفیف‌های دانشجویی',
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
        text: 'فیدبک‌های اعضا',
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
        text: 'آپشن‌های پرداخت',
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
        text: 'درباره لیتیم',
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
        text: 'ایده‌های نو',
        href: '#',
      },
    ],
    icons: [
      {
        text: 'fa fa-twitter-square icons'
      },
      {
        text: 'fa fa-facebook-square icons'
      },
      {
        text: 'fa fa-linkedin-square icons'
      },
      {
        text: 'fa fa-instagram icons'
      }
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
