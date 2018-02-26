import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlacementService} from '../../services/placement.service';

@Component({
  selector: 'app-sliding-header',
  templateUrl: './sliding-header.component.html',
  styleUrls: ['./sliding-header.component.css']
})
export class SlidingHeaderComponent implements OnInit, OnDestroy {
  curSlideIndex = 0;
  slides = [];
  slidess = [
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

  constructor(private placementService: PlacementService) {
  }

  ngOnInit() {
    this.placementService.placement$.filter(r => r[0] === 'slider').map(r => r[1]).subscribe(
      data => {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          this.slides.push({});
          this.slides[i].text = data[i].variable_name;
          this.slides[i].imgAddr = data[i].info.imgUrl;
          this.slides[i].href = data[i].info.href;
        }
        console.log(this.slides);
      });


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
