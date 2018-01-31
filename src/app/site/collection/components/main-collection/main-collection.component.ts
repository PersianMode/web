  import {Component, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
  import { DOCUMENT } from '@angular/platform-browser';
  import { WINDOW } from '../../../../shared/services/window.service';


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
          name: 'جوردن ایر مدل ‍۱۰ رترو',
          colors: [
            {
              url: '06.jpg',
              position: 0,
            },
          ],
          tags: ['کفش', 'مردانه', 'بسکتبال'],
          price: 499900,
        },
        {
          name: 'له‌برون مدل 15 BHM',
          colors: [
            {
              url: '01.jpg',
              position: 0,
            },
          ],
          tags: ['کفش', 'مردانه', 'بسکتبال'],
          price: 1499900,
        },
        {
          name: 'نایک ایر مدل Huarache Drift',
          colors: [
            {
              url: '02.jpg',
              position: 0,
              pi_id: 0,
            },
            {
              url: '02.jpg',
              position: 1,
              pi_id: 0,
            },
            {
              url: '02.jpg',
              position: 2,
              pi_id: 0,
            },
            {
              url: '11.jpg',
              position: 0,
              pi_id: 0,
            },
            {
              url: '12.jpeg',
              position: 0,
              pi_id: 0,
            },
            {
              url: '13.jpeg',
              position: 0,
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
              url: '03.jpg',
              position: 0,
              pi_id: 0,
            },
            {
              url: '03.jpg',
              position: 1,
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
              url: '04.jpg',
              position: 0,
              pi_id: 0,
            },
            {
              url: '04.jpg',
              position: 1,
              pi_id: 0,
            },
            {
              url: '04.jpg',
              position: 2,
              pi_id: 0,
            },
          ]
        },
        {
          name: 'کایری 4',
          colors: [
            {
              url: '05.jpg',
              position: 0,
              pi_id: 0,
            },
            {
              url: '05.jpg',
              position: 1,
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
              url: '07.jpg',
              position: 0,
              pi_id: 0,
            },
            {
              url: '07.jpg',
              position: 1,
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
              url: '08.jpg',
              position: 0,
              pi_id: 0,
            },
            {
              url: '08.jpg',
              position: 1,
              pi_id: 0,
            },
            {
              url: '08.jpg',
              position: 2,
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
              position: 0,
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
    constructor(@Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window) {
    }

    ngOnInit() {
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
      const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
      const height = this.window.innerHeight - 209;
      const filterHeight = this.filterPane.nativeElement.scrollHeight;
      const docHeight = Math.max(filterHeight, this.gridwall.nativeElement.scrollHeight) + 209;
      this.topFixedFilterPanel = offset >= 102 && filterHeight < height;
      this.bottomFixedFilterPanel = filterHeight > height && filterHeight - offset < height && docHeight - offset > height + 180;
      this.bottomScroll = docHeight - offset < height + 180;
      this.topDist = height - filterHeight + 209;
      console.log(this.bottomFixedFilterPanel, docHeight - offset, height, docHeight)
    }
  }
