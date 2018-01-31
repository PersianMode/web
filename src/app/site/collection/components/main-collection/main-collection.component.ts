  import {Component, HostListener, Inject, OnInit} from '@angular/core';
  import { DOCUMENT } from '@angular/platform-browser';
  import { WINDOW_PROVIDERS, WINDOW } from '../../../../shared/services/window.service';


  @Component({
    selector: 'app-main-collection',
    templateUrl: './main-collection.component.html',
    styleUrls: ['./main-collection.component.css']
  })
  export class MainCollectionComponent implements OnInit {
    collection = {
      collectionNameFa: 'کفش‌های مردانه',
      collectionName: 'men-shoes',
      set: [
        {
          name: 'جوردن ایر مدل ‍۱۰ رترو',
          colors: [
            {
              url: '06',
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
              url: '01',
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
              url: '02',
              position: 0,
              pi_id: 0,
            },
            {
              url: '02',
              position: 1,
              pi_id: 0,
            },
            {
              url: '02',
              position: 2,
              pi_id: 0,
            },
            {
              url: '11',
              position: 0,
              pi_id: 0,
            },
            {
              url: '12',
              position: 0,
              pi_id: 0,
            },
            {
              url: '13',
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
              url: '03',
              position: 0,
              pi_id: 0,
            },
            {
              url: '03',
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
              url: '04',
              position: 0,
              pi_id: 0,
            },
            {
              url: '04',
              position: 1,
              pi_id: 0,
            },
            {
              url: '04',
              position: 2,
              pi_id: 0,
            },
          ]
        },
        {
          name: 'کایری 4',
          colors: [
            {
              url: '05',
              position: 0,
              pi_id: 0,
            },
            {
              url: '05',
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
              url: '07',
              position: 0,
              pi_id: 0,
            },
            {
              url: '07',
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
              url: '08',
              position: 0,
              pi_id: 0,
            },
            {
              url: '08',
              position: 1,
              pi_id: 0,
            },
            {
              url: '08',
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
              url: '13',
              position: 0,
              pi_id: 0,
            },
          ],
          tags: ['کفش', 'مردانه', 'بسکتبال'],
          price: 999900,
        },
      ]
    };

    fixedFilterPanel = false;
    constructor(@Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window) {
    }

    ngOnInit() {
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
      const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
      this.fixedFilterPanel = offset >= 102
    }
  }
