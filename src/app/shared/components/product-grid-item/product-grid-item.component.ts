import {Component, Input, OnInit, NgZone, Inject, ViewChild, HostListener} from '@angular/core';
import {WINDOW} from '../../services/window.service';
import {Router} from '@angular/router';
import {priceFormatter} from '../../lib/priceFormatter';
import {ResponsiveService} from '../../services/responsive.service';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpService} from '../../services/http.service';
import {DictionaryService} from '../../services/dictionary.service';
import {ProductService} from '../../services/product.service';

const tagNames = ['Sub Division', 'Category', 'Gender'];

const findInParentNodes = function(needle, element) {
  if (!element)
    return false;
  if (element === needle) {
    return true;
  }
  return findInParentNodes(needle, element.parentNode);
};
@Component({
  selector: 'app-product-grid-item',
  templateUrl: './product-grid-item.component.html',
  styleUrls: ['./product-grid-item.component.css']
})
export class ProductGridItemComponent implements OnInit {
  @Input() data;
  @Input() width;
  @Input() height;
  myColors = [];
  @ViewChild('slider') slider;
  @ViewChild('wrapper') wrapper;
  pos = 0;
  desc = '';
  price = '';
  on = false;
  isOnSlide = false;
  images = [];
  colors = [];

  slide = 0;
  slidesNum = 0;
  rect;
  isMobile = false;
  soldOut = false;
  discounted = false;
  discountedPrice: any;
  isLoaded = false;

  constructor(@Inject(WINDOW) private window, private zone: NgZone, private router: Router,
              private responsiveService: ResponsiveService, private sanitizer: DomSanitizer,
              private dict: DictionaryService, private ps: ProductService) {
    this.zone.runOutsideAngular(() => {
      this.window.document.addEventListener('mousemove', this.mouseMove.bind(this));
    });
  }

  ngOnInit() {
    this.data.colors.forEach(color => {
      this.myColors = this.myColors.concat(
        color.name.split('/')
          .map(r => r.split('-')).reduce((x, y) => x.concat(y), [])
          .map(r => this.dict.convertColor(r.trim()))
          .filter(r => r));
    });
    this.myColors = this.myColors.filter((r, i, o) => o.indexOf(r) === i);
    this.desc = this.data.tags
      .filter(r => tagNames.includes(r.tg_name))
      .sort((x, y) => tagNames.findIndex(r => x.tg_name === r) - tagNames.findIndex(r => y.tg_name === r))
      .map(x => this.dict.translateWord(x.name.trim()))
      .join(' ');
    this.setPrice();
    this.isMobile = this.responsiveService.isMobile;
    const arrImages = this.data.colors.map(r => this.isMobile && r.image.angles[0] ? r.image.angles[0].url : r.image.thumbnail);
    this.images = Array.from(new Set<string>(arrImages));
    this.slidesNum = Math.ceil(this.data.colors.length / 3);

    this.responsiveService.switch$.subscribe(isMobile => {
      this.isMobile = isMobile;
      const arrImages = this.data.colors.map(r => this.isMobile && r.image.angles[0] ? r.image.angles[0].url : r.image.thumbnail);
      this.images = Array.from(new Set<string>(arrImages));
      this.slidesNum = Math.ceil(this.data.colors.length / 3);
    });
    this.soldOut = this.data.soldOut;
    const firstAvailableIndex = this.data.colors.findIndex(c => !c.soldOut);
    this.pos = firstAvailableIndex !== -1 ? firstAvailableIndex : 0;
    this.discounted = !!this.data.discount;
    this.setPrice();
  }

  private setPrice() {
    this.price = priceFormatter(this.data.colors[this.pos].price);
    this.discountedPrice = priceFormatter(this.data.colors[this.pos].discountedPrice);
  }

  turnOn() {
    setTimeout(() => {
      this.on =  true;
    }, 100);
    if (this.slider) {
      this.rect = this.slider.nativeElement.getBoundingClientRect();
    }
  }

  turnOff(event) {
    setTimeout(() => {
      if (findInParentNodes(this.wrapper.nativeElement, event.toElement)) {
        return;
      }
      this.on = false;
    }, 100);
  }


  slideOn() {
    setTimeout( () => {
      this.isOnSlide = true;
    }, 10);
  }

  slideOff(event) {
    setTimeout( () => {
      if (findInParentNodes(this.slider.nativeElement, event.toElement)) {
        return;
      }
      this.isOnSlide = false;
    }, 10);
  }

  changePos(i) {
    this.pos = i;
    this.setPrice();
  }

  nextSlide() {
    this.slide++;
  }

  prevSlide() {
    this.slide--;
  }

  mouseMove(event) {
    if (this.isOnSlide && this.slider && this.rect && this.rect.left) {
      const i = Math.floor(Math.max(0, Math.min(179, (this.rect.right - event.clientX))) / 60) + this.slide * 3;
      if (i > -1 && i < this.data.colors.length) {
        this.zone.run(() => this.changePos(i));
      }
    }
  }

  openProduct() {
    this.router.navigate(['product', this.data._id, this.data.colors[this.pos]._id]);
  }

  getURL(url) {
    return HttpService.Host + url;
  }
  openNewTab() {
    return `product/${this.data._id}/${this.data.colors[this.pos]._id}`;
  }

}
