import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageService} from '../../services/page.service';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpService} from '../../services/http.service';

const defaultStyle = {
  imgWidth: 40,
  imgMarginLeft: 5,
  imgMarginTop: 0,
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

  constructor(private pageService: PageService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.pageService.placement$.filter(r => r[0] === 'slider').map(r => r[1]).subscribe(
      data => {
        this.slides = [];
        if (data) {
          for (let i = 0; i < data.length; i++) {
            this.slides.push({});
            // this.slides[i].text = data[i].variable_name;
            this.slides[i].text = data[i].info.text;
            this.slides[i].href = data[i].info.href;
            this.slides[i].imgAddr = data[i].info.imgUrl;
            this.slides[i].column = data[i].info.column;
            for (const key in defaultStyle) {
              if (defaultStyle.hasOwnProperty(key)) {
                this.slides[i][key] = data[i].info.style && data[i].info.style[key] ? data[i].info.style[key] : defaultStyle[key];
              }
            }
          }
        }

        this.slides.sort((a, b) => a.column > b.column ? 1 : (a.column < b.column) ? -1 : 0);
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

  getURL(path: string) {
    if (path)
      return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + path);
  }
}
