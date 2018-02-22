import {Component, HostListener, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WINDOW} from '../../../../shared/services/window.service';
import {DOCUMENT} from '@angular/platform-browser';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';

@Component({
  selector: 'app-desktop-product',
  templateUrl: './desktop-product.component.html',
  styleUrls: ['./desktop-product.component.css']
})
export class DesktopProductComponent implements OnInit {
  @Input() product;
  @Input() price;
  @Input() sub;
  @Input() id;
  @ViewChild('descPane') descPane;
  @ViewChild('photosDiv') photosDiv;
  topFixedFilterPanel = false;
  bottomFixedFilterPanel = false;
  bottomScroll = false;
  topDist = 0;
  innerHeight = 0;
  innerScroll = false;
  size: number;

  constructor(private router: Router, @Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window) {
  }

  ngOnInit() {
  }

  up() {
    this.router.navigate(['product', +this.id + 1]);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    const height = this.window.innerHeight - 209;
    const filterHeight = this.descPane.nativeElement.scrollHeight;
    const docHeight = this.photosDiv.nativeElement.scrollHeight + 209;
    this.innerScroll = docHeight - filterHeight < 0;
    this.innerHeight = docHeight - 261;
    this.topFixedFilterPanel = !this.innerScroll && offset >= 65 && filterHeight < height;
    this.bottomScroll = docHeight - offset - height < 180;
    this.bottomFixedFilterPanel = !this.innerScroll && !this.topFixedFilterPanel && !this.bottomScroll
                                  && filterHeight - offset < height && offset >= 65;
    this.topDist = height - filterHeight + 209;
  }

}
