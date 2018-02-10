import {Component, Input, OnInit, NgZone, Inject, ViewChild} from '@angular/core';
import {WINDOW} from '../../services/window.service';
import {Router} from '@angular/router';
import {priceFormatter} from '../../lib/priceFormatter';

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

  constructor(@Inject(WINDOW) private window, private zone: NgZone, private router: Router) {
    this.zone.runOutsideAngular(() => {
      this.window.document.addEventListener('mousemove', this.mouseMove.bind(this));
    });
  }

  ngOnInit() {
    this.desc = this.data.tags.join(' ');
    this.price = priceFormatter(this.data.price);
    this.images = Array.from(new Set<any>(this.data.colors.map(r => r.url)).values());
    this.slidesNum = Math.ceil(this.data.colors.length / 3);
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

  openProduct() {
    this.router.navigate(['product', this.data.colors[this.pos].pi_id]);
  }
}
