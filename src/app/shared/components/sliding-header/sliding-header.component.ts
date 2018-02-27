import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlacementService} from '../../services/placement.service';

const defaultStyle = {
  imgWidth: 40,
  imgMarginLeft: 5,
};

@Component({
  selector: 'app-sliding-header',
  templateUrl: './sliding-header.component.html',
  styleUrls: ['./sliding-header.component.css']
})
export class SlidingHeaderComponent implements OnInit, OnDestroy {
  curSlideIndex = 0;
  slides = [];
  slider: any;

  constructor(private placementService: PlacementService) {
  }

  ngOnInit() {
    this.placementService.placement$.filter(r => r[0] === 'slider').map(r => r[1]).subscribe(
      data => {
        console.log('data2 :', data);
        for (let i = 0; i < data.length; i++) {
          this.slides.push({});
          this.slides[i].text = data[i].variable_name;
          this.slides[i].imgAddr = data[i].info.imgUrl;
          for (const key in defaultStyle) {
            if (defaultStyle.hasOwnProperty(key)) {
              this.slides[i][key] = data[i].info.style && data[i].info.style[key] ? data[i].info.style[key] : defaultStyle[key];
            }
          }
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
