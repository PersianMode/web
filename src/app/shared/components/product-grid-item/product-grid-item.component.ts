import {Component, Input, OnInit, NgZone, Inject, ViewChild, HostListener} from '@angular/core';
import {WINDOW} from '../../services/window.service';
import {Router} from '@angular/router';
import {priceFormatter} from '../../lib/priceFormatter';
import {ResponsiveService} from '../../services/responsive.service';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpService} from '../../services/http.service';

@Component({
  selector: 'app-product-grid-item',
  templateUrl: './product-grid-item.component.html',
  styleUrls: ['./product-grid-item.component.css']
})
export class ProductGridItemComponent implements OnInit {
  @Input() data;
  @Input() width;
  @Input() height;
  @ViewChild('slider') slider;
  pos = 0;
  desc = '';
  price = '';
  on = 0;
  images = [];
  colors = [];
  slide = 0;
  slidesNum = 0;
  rect;
  isMobile = false;


  constructor(@Inject(WINDOW) private window, private zone: NgZone, private router: Router,
              private responsiveService: ResponsiveService, private sanitizer: DomSanitizer) {
    this.zone.runOutsideAngular(() => {
      this.window.document.addEventListener('mousemove', this.mouseMove.bind(this));
    });
  }

  ngOnInit() {
    this.desc = this.data.tags.map(x => x.name).join(' ');
    this.price = priceFormatter(this.data.base_price);

    const arrImages = this.data.colors.map(r => r.image.thumbnail);
    this.images = Array.from(new Set<string>(arrImages));
    this.slidesNum = Math.ceil(this.data.colors.length / 3);
    this.isMobile = this.responsiveService.isMobile;
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
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
    this.router.navigate(['product', this.data._id, this.data.colors[this.pos].id]);
  }

  getURL(url) {
   return HttpService.Host + url;
  }

}
