import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sliding-header',
  templateUrl: './sliding-header.component.html',
  styleUrls: ['./sliding-header.component.css']
})
export class SlidingHeaderComponent implements OnInit {
  curSlideIndex = 0;
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
  slider: any;

  constructor() { }

  ngOnInit() {
  }

  nextSlide() {
    this.curSlideIndex++;
  }

  prevSlide() {
    this.curSlideIndex--;
  }
}
