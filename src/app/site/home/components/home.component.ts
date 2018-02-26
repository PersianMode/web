import {Component, Inject, OnInit} from '@angular/core';
import {WINDOW} from '../../../shared/services/window.service';
import {AuthService} from '../../../shared/services/auth.service';
import {PlacementService} from '../../../shared/services/placement.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  curWidth = 100;
  curHeight = 100;
  placementss = {
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
        mobileMode: false,
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
        mobileMode: true,
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
  placements: any = [];

  constructor(@Inject(WINDOW) private window, private authService: AuthService, private placementService: PlacementService) {
  }

  ngOnInit() {
    this.placementService.placement$.filter(r => r[0] === 'main').map(r => r[1]).subscribe(
      data => {
        /* filter by date add be later */
        const infos = [];
        data.forEach(r => infos.push(r.info));
        for (let i = 0; i < infos.length; i++) {
          console.log(infos[i]);
          let numberOfPicture = 1;
          if (infos[i].panel_type === 'half') {
            numberOfPicture = 2;
          } else if (infos[i].panel_type === 'third') {
            numberOfPicture = 3;
          } else if (infos[i].panel_type === 'quarter') {
            numberOfPicture = 4;
          }
          const object: any = {};
          object.type = infos[i].panel_type;
          object.imgs = [];
          for (let j = i; j < i + numberOfPicture; j++) {
            if (infos[j]) {
              object.imgs.push({});
              if (infos[j].topTitle) {
                object.topTitle = infos[i].topTitle;
              }
              if (infos[j].href) {
                object.imgs[j - i].href = '/'.concat(infos[j].href);
              }
              if (infos[j].areas) {
                object.imgs[j - i].areas = infos[j].areas;
              }
              if (infos[j].imgUrl) {
                object.imgs[j - i].imgUrl = infos[j].imgUrl;
              }
              if (infos[j].subTitle) {
                object.imgs[j - i].subTitle = infos[j].subTitle;
              }
            }
          }
          this.placements.push(object);
          i += numberOfPicture - 1;
        }
        console.log(this.placements);
        console.log(this.placementss.panels);
      }
    );
    this.placementService.getPlacements('');
    this.curWidth = this.window.innerWidth;
    this.curHeight = this.window.innerHeight;

    this.window.onresize = (e) => {
      this.curWidth = this.window.innerWidth;
      this.curHeight = this.window.innerHeight;
    };
  }

}
