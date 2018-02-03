import { Component, Inject, OnInit } from '@angular/core';
import {WINDOW} from '../../../shared/services/window.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  curWidth = 100;
  curHeight = 100;
  footer = {
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
}
  constructor(@Inject(WINDOW) private window) { }
  ngOnInit() {
    this.curWidth = this.window.innerWidth;
    this.curHeight = this.window.innerHeight;

    this.window.onresize = (e) => {
      this.curWidth = this.window.innerWidth;
      this.curHeight = this.window.innerHeight;
    };
  }

}
