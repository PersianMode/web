import {Component, Inject, OnInit} from '@angular/core';
import {WINDOW} from '../../../shared/services/window.service';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  curWidth = 100;
  curHeight = 100;
  placements = {
    panels: [
      {
        type: 'full',
        topTitle: {
          title: '',
          text: '',
          color: '',
        },
        subTitle: {
          title: '',
          text: '',
          color: '',
        },
        imgs: [
          {
            imgUrl: '../../../../assets/pictures/nike-first-page-pic/pm-1.png',
            href: '#',
            subTitle: {
              title: 'dsds',
              text: 'ddfd',
              color: 'black',
              textColor: 'gray',
            },
            areas: [
              {
                pos: 'left-center',
                title: 'متفاوت باش!',
                text: 'حرکت رو به جلو ...',
              },
            ],
          },
        ]
      },
      {
        type: 'full',
        imgs: [
          {
            imgUrl: '../../../../assets/pictures/nike-first-page-pic/pm-2.png',
            href: '#',
            areas: [
              {
                pos: 'right-center',
                title: 'مثل همیشه، فراتر از زمان!',
                text: 'معرفی محصولات جدید نایک پلاس',
                color: 'black',
              },
            ],
          },
        ]
      },
      {
        type: 'full',
        imgs: [
          {
            imgUrl: '../../../../assets/pictures/nike-first-page-pic/pm-7.png',
            href: '#',
            areas: [
              {
                pos: 'left-center',
                title: 'طوسی بی نظیر!',
                text: 'برای اولین بار',
              },
            ],
          },
        ]
      },
      {
        mobileMode : false,
        type: 'full',
        imgs: [
          {
            imgUrl: '../../../../assets/pictures/nike-first-page-pic/pm-4.png',
            href: '#',
            areas: [
              {
                pos: 'left-center',
                title: 'کاملا گرم',
                text: 'محصولات پشمی مناسب زمستان',
              }, {
                pos: 'right-center',
                title: 'زمان درخشیدن توست!',
                text: 'نایک، حامی تیم ملی در طول بازیها',
              },
            ],
          },
        ]
      },
      {
        mobileMode : true,
        type: 'half',
        imgs: [
          {
            imgUrl: '../../../../assets/pictures/nike-first-page-pic/half-1.png',
            href: '#',
            areas: [{
              pos: 'left-center',
              title: 'کاملا گرم',
              text: 'محصولات پشمی مناسب زمستان',
            },
            ]
          },
          {
            imgUrl: '../../../../assets/pictures/nike-first-page-pic/half-2.png',
            href: '#',
            areas: [
              {
                pos: 'right-center',
                title: 'زمان درخشیدن توست!',
                text: 'نایک، حامی تیم ملی در طول بازیها',
              },
            ],
          },
        ]
      },
      {
        type: 'quarter',
        topTitle: {
          title: 'رنگهای جدید، دلخواه شما',
          text: '',
          color: 'black',
        },
        imgs: [
          {
            imgUrl: '../../../../assets/pictures/nike-first-page-pic/q1.png',
            href: '#',
            subTitle: {
              title: 'کفش راحتی زنانه، مدل ژاکلین',
              text: 'کفش زنانه',
              color: 'black',
              textColor: 'gray',
            },
            areas: [],
          },
          {
            imgUrl: '../../../../assets/pictures/nike-first-page-pic/q2.png',
            href: '#',
            subTitle: {
              title: 'کفش کارمندی زنانه',
              text: 'کفش زنانه',
              color: 'black',
              textColor: 'gray',
            },
            areas: [],
          },
          {
            imgUrl: '../../../../assets/pictures/nike-first-page-pic/q3.png',
            href: '#',
            subTitle: {
              title: 'کفش ورزشی زنانه نایک، سری نایک پلاس',
              text: 'کفش ورزشی زنانه',
              color: 'black',
              textColor: 'gray',
            },
            areas: [],
          },
          {
            imgUrl: '../../../../assets/pictures/nike-first-page-pic/q4.png',
            href: '#',
            subTitle: {
              title: 'کفش پیاده روی زنانه نایک، مدل پگاسوس',
              text: 'کفش پیاده روی زنانه',
              color: 'black',
              textColor: 'gray'
            },
            areas: [],
          },
        ]
      },
    ]
  }

  constructor(@Inject(WINDOW) private window, private authService: AuthService) {
  }

  ngOnInit() {
    this.curWidth = this.window.innerWidth;
    this.curHeight = this.window.innerHeight;

    this.window.onresize = (e) => {
      this.curWidth = this.window.innerWidth;
      this.curHeight = this.window.innerHeight;
    };
  }

}
