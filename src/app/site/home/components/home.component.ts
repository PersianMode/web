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
        imgUrl: '../../../../assets/pictures/pw-1.png',
        href: '#',
        areas: [
          {
            pos: 'left-center',
            title: 'متفاوت باش!',
            text: 'حرکت رو به جلو ...',
          },
        ],
        type: 'full',
      },
      {
        imgUrl: '../../../../assets/pictures/pw-2.png',
        href: '#',
        areas: [
          {
            pos: 'right-center',
            title: 'مثل همیشه، فراتر از زمان!',
            text: 'معرفی محصولات جدید نایک پلاس',
            color: 'black',
          },
        ],
        type: 'full',
      },
      {
        imgUrl: '../../../../assets/pictures/pw-7.png',
        href: '#',
        areas: [
          {
            pos: 'left-center',
            title: 'خاکستری بی نظیر!',
            text: 'برای اولین بار',
          },
        ],
        type: 'full',
      },
      {
        imgUrl: '../../../../assets/pictures/pw-4.png',
        href: '#',
        areas: [
          {
            pos: 'left-center',
            title: 'کاملا گرم',
            text: 'محصولات ابریشمی مناسب زمستان',
          },
          {
            pos: 'right-center',
            title: 'زمان درخشیدن توست!',
            text: 'نایک، حامی تیم ملی در طول بازیها',
          },
        ],
        type: 'full',
      },
      {
        imgUrl: '../../../../assets/pictures/pw-5.png',
        href: '#',
        areas: [
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
  }

  constructor() { }

  ngOnInit() {
  }

}
