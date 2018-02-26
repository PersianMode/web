import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlacementService} from '../../services/placement.service';

@Component({
  selector: 'app-sliding-header',
  templateUrl: './sliding-header.component.html',
  styleUrls: ['./sliding-header.component.css']
})
export class SlidingHeaderComponent implements OnInit, OnDestroy {
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

  constructor( private placementService: PlacementService) { }

  ngOnInit() {
    this.initSlider();
  }

  ngOnDestroy() {
    clearInterval(this.slider);
  }

  initSlider() {
    clearInterval(this.slider);
    this.slider = setInterval(() => this.curSlideIndex = (this.curSlideIndex + 1) % this.slides.length, 5000);
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
