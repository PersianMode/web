import {Component, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {WINDOW} from '../../../../shared/services/window.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PageService} from '../../../../shared/services/page.service';


@Component({
  selector: 'app-main-collection',
  templateUrl: './main-collection.component.html',
  styleUrls: ['./main-collection.component.css']
})
export class MainCollectionComponent implements OnInit {
  collection = {
    collectionNameFa: 'تازه‌های مردانه',
    collectionName: 'men-shoes',
    set: [
      {
        name: 'جوردن ا  یر مدل ‍۱۰ رترو',
        colors: [
          {
            url: '06.jpg',
          },
        ],
        tags: ['کفش', 'مردانه', 'بسکتبال'],
        price: 499900,
      },
      {
        name: 'کایری ۳ مدل What The',
        colors: [
          {
            url: '14.jpeg',
            pi_id: 14,
          },
        ],
        tags: ['کفش', 'بسکتبال', 'نوجوانان'],
        price: 599000,
      },
      {
        name: 'له‌برون مدل 15 BHM',
        colors: [
          {
            url: '01-1.jpg',
          },
        ],
        tags: ['کفش', 'مردانه', 'بسکتبال'],
        price: 1499900,
      },
      {
        name: 'نایک ایر مدل Huarache Drift',
        colors: [
          {
            url: '02-1.jpg',
            pi_id: 0,
            hex: '#32ff14',
          },
          {
            url: '02-2.jpg',
            pi_id: 0,
            hex: '#f21353',
          },
          {
            url: '02-3.jpg',
            pi_id: 0,
          },
          {
            url: '11.jpeg',
            pi_id: 0,
          },
          {
            url: '12.jpeg',
            pi_id: 0,
          },
        ],
        tags: ['کفش', 'مردانه'],
        price: 1499900,
      },
      {
        name: 'نایک ایر',
        colors: [
          {
            url: '03-1.jpg',
            pi_id: 0,
          },
          {
            url: '03-2.jpg',
            pi_id: 1,
          },
        ],
        tags: ['تاپ', 'نیم‌زیپ', 'مردانه'],
        price: 499900,
      },
      {
        name: 'نایک ایر فورس ۱ مدل Premium \'07',
        colors: [
          {
            url: '04-1.jpg',
            pi_id: 0,
          },
          {
            url: '04-2.jpg',
            pi_id: 0,
          },
          {
            url: '04-3.jpg',
            pi_id: 0,
          },
        ],
        tags: ['کفش', 'مردانه', 'بسکتبال'],
        price: 1099900,
      },
      {
        name: 'کایری 4',
        colors: [
          {
            url: '05-1.jpg',
            pi_id: 0,
          },
          {
            url: '05-2.jpg',
            pi_id: 0,
          },
        ],
        tags: ['کفش', 'مردانه', 'بسکتبال'],
        price: 799900,
      },
      {
        name: 'نایک Sportswear',
        colors: [
          {
            url: '07-1.jpg',
            pi_id: 0,
          },
          {
            url: '07-2.jpg',
            pi_id: 0,
          },
          {
            url: '07-3.jpg',
            pi_id: 0,
          },
        ],
        tags: ['جکت', 'مردانه'],
        price: 899900,
      },
      {
        name: 'نایک Sportswear Tech Shield',
        colors: [
          {
            url: '08-1.jpg',
            pi_id: 0,
          },
          {
            url: '08-2.jpg',
            pi_id: 0,
          },
          {
            url: '08-3.jpg',
            pi_id: 0,
          },
        ],
        tags: ['جکت', 'مردانه'],
        price: 1399900,
      },
      {
        name: 'نایک مدل Kobe A.D. Black Mamba',
        colors: [
          {
            url: '13.jpeg',
            pi_id: 0,
          },
        ],
        tags: ['کفش', 'مردانه', 'بسکتبال'],
        price: 999900,
      },
    ]
  };
  @ViewChild('filterPane') filterPane;
  @ViewChild('gridwall') gridwall;
  topFixedFilterPanel = false;
  bottomFixedFilterPanel = false;
  bottomScroll = false;
  topDist = 0;
  innerHeight = 0;
  innerScroll = false;
  pageName = '';

  constructor(private route: ActivatedRoute, @Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window, private pageService: PageService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.pageName = 'collection/' + params.get('typeName');
      this.pageService.getPage(this.pageName);
      setTimeout(() => this.onWindowScroll(), 1000);
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    const height = this.window.innerHeight - 209;
    const filterHeight = this.filterPane.nativeElement.scrollHeight;
    const docHeight = this.gridwall.nativeElement.scrollHeight + 209;
    this.innerScroll = docHeight - filterHeight < 0;
    this.innerHeight = docHeight - 209;
    this.topFixedFilterPanel = !this.innerScroll && offset >= 65 && filterHeight < height;
    this.bottomScroll = docHeight - offset - height < 180;
    this.bottomFixedFilterPanel = !this.topFixedFilterPanel && !this.bottomScroll && filterHeight - offset < height;
    this.topDist = height - filterHeight + 228;

  }
}
