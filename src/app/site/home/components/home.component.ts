import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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
            imgUrl: '../../../../assets/pictures/pm-1.png',
            href: '#',
            topTitle: {
              title: '',
              text: '',
              color: '',
              textColor: ''
            },
            subTitle: {
              title: '',
              text: '',
              color: '',
              textColor: '',
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
            imgUrl: '../../../../assets/pictures/pm-2.png',
            href: '#',
            topTitle: {
              title: '',
              text: '',
              color: '',
              textColor: ''
            },
            subTitle: {
              title: '',
              text: '',
              color: 'black',
              textColor: 'gray',
            },
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
            imgUrl: '../../../../assets/pictures/pm-7.png',
            href: '#',
            topTitle: {
              title: '',
              text: '',
              color: '',
              textColor: ''
            },
            subTitle: {
              title: '',
              text: '',
              color: 'black',
              textColor: 'gray',
            },
            areas: [
              {
                pos: 'left-center',
                title: 'خاکستری بی نظیر!',
                text: 'برای اولین بار',
              },
            ],
          },
        ]
      },
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
            imgUrl: '../../../../assets/pictures/pm-4.png',
            href: '#',
            topTitle: {
              title: '',
              text: '',
              color: '',
              textColor: ''
            },
            subTitle: {
              title: '',
              text: '',
              color: '',
              textColor: '',
            },
            areas: [
              {
                pos: 'left-center',
                title: 'کاملا گرم',
                text: 'محصولات پشمی مناسب زمستان',
              },
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
        subTitle: {
          title: '',
          text: '',
          color: 'black',
        },
        imgs: [
          {
            imgUrl: '../../../../assets/pictures/q1.png',
            href: '#',
            topTitle: {
              title: '',
              text: '',
              color: '',
              textColor: ''
            },
            subTitle: {
              title: 'کفش راحتی زنانه، مدل ژاکلین',
              text: 'کفش زنانه',
              color: 'black',
              textColor: 'gray',
            },
            areas: [],
          },
          {
            imgUrl: '../../../../assets/pictures/q2.png',
            href: '#',
            topTitle: {
              title: '',
              text: '',
              color: '',
              textColor: ''
            },
            subTitle: {
              title: 'کفش کارمندی زنانه',
              text: 'کفش زنانه',
              color: 'black',
              textColor: 'gray',
            },
            areas: [
            ],
          },
          {
            imgUrl: '../../../../assets/pictures/q3.png',
            href: '#',
            topTitle: {
              title: '',
              text: '',
              color: '',
              textColor: ''
            },
            subTitle: {
              title: 'کفش ورزشی زنانه نایک، سری نایک پلاس',
              text: 'کفش ورزشی زنانه',
              color: 'black',
              textColor: 'gray',
            },
            areas: [],
          },
          {
            imgUrl: '../../../../assets/pictures/q4.png',
            href: '#',
            topTitle: {
              title: '',
              text: '',
              color: '',
              textColor: ''
            },
            subTitle: {
              title: 'کفش پیاده روی زنانه نایک، مدل پگاسوس',
              text: 'کفش پیاده روی زنانه',
              color: 'black',
              textColor: 'gray'
            },
            // areas: [{
            //     pos: 'right-bottom',
            //     title: 'خاکستری بی نظیر!',
            //     text: 'برای اولین بار',
            //     color: 'black',
            //   },
            // ],
            areas: [
            ],
          },
        ]
      },
    ]
  }

  constructor() { }

  ngOnInit() {
  }

}
