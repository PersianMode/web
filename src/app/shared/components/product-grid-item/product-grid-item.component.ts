import {Component, Input, OnInit, NgZone, Inject, ViewChild} from '@angular/core';
import {WINDOW} from '../../services/window.service';

@Component({
  selector: 'app-product-grid-item',
  templateUrl: './product-grid-item.component.html',
  styleUrls: ['./product-grid-item.component.css']
})
export class ProductGridItemComponent implements OnInit {
  @Input('data') data;
  @ViewChild('slider') slider;
  pos = 0;
  desc = '';
  price = '';
  on = 0;
  images = [];
  slide = 0;
  slidesNum = 0;
  rect;
  onTime: any;

  constructor(@Inject(WINDOW) private window, private zone: NgZone) {
    this.zone.runOutsideAngular(() => {
      this.window.document.addEventListener('mousemove', this.mouseMove.bind(this));
    });
  }

  ngOnInit() {
    this.desc = this.data.tags.join(' ');
    this.price = this.priceFormatter(this.data.price);
    this.images = Array.from(new Set<any>(this.data.colors.map(r => r.url)).values());
    this.slidesNum = Math.ceil(this.data.colors.length / 3);
  }

  priceFormatter(p) {
    let ret = '';
    (p + '').split('').reverse().forEach((digit, ind) => {
      ret = parseInt(digit, 10).toLocaleString('fa') + ret;
      if (ind % 3 === 2 && ind !== Math.floor(Math.log10(p))) {
        ret = '٫' + ret;
      }
    });
    return ret;
  }

  turnOn(e, time) {
    setTimeout(() => {
      this.on = e || true;
    }, time || 100);
    if (this.slider) {
      this.rect = this.slider.nativeElement.getBoundingClientRect();
    }
  }

  turnOff() {
    setTimeout(() => {
        this.on = 0;
    }, 100);
  }

  changePos(i) {
    this.pos = i;
  }

  nextSlide() {
    this.slide++;
  }

  prevSlide() {
    this.slide--;
  }

  mouseMove(event) {
    if (this.slider && this.rect && this.rect.left && this.on === 2) {
      const i = Math.floor(Math.max(0, Math.min(179, (this.rect.right - event.clientX))) / 60) + this.slide * 3;

      if (i > -1 && i < this.data.colors.length) {
        this.zone.run(() => this.changePos(i));
      }
    }
  }
}
