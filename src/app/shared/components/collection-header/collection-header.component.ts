import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-collection-header',
  templateUrl: './collection-header.component.html',
  styleUrls: ['./collection-header.component.css']
})
export class CollectionHeaderComponent implements OnInit {
  hiddenGenderMenu = true;
  selected = {
    men: false,
    women: false,
    boys: false,
    girls: false,
  };
  persistedList = false;
  searchIsFocused = false;
  menu = {};
  topMenu = [
    {
      collectionName: 'men',
      collectionNameFa: 'مردانه',
      collectionRoute: '#',
    },
    {
      collectionName: 'women',
      collectionNameFa: 'زنانه',
      collectionRoute: '#',
    },
    {
      collectionName: 'girls',
      collectionNameFa: 'دخترانه',
      collectionRoute: '#',
    },
    {
      collectionName: 'boys',
      collectionNameFa: 'پسرانه',
      collectionRoute: '#',
    },
    {
      collectionName: 'test',
      collectionNameFa: 'test',
      collectionRoute: '#',
    },
  ];
  placements = {
    menMenu: {
      headerList: [
        {
          text: 'تازه‌ها',
          href: 'collection/x',
        },
        {
          text: 'پرفروش‌ها',
          href: '#',
        },
        {
          text: 'مجموعه Equality',
          href: '#',
        },
        {
          text: 'زیر ۵۰۰ هزار تومان',
          href: '#',
        },
        {
          text: 'داره مد می‌شه',
          href: '#',
        },
        {
          text: 'مجموعه Fleece',
          href: '#',
        },
        {
          text: 'برای فصل سرما',
          href: '#',
        },
      ],
      middle: [
        [
          {
            text: 'کفش‌ها',
            href: '#',
          },
          {
            text: 'دو',
            href: '#',
          },
          {
            text: 'فوتبال',
            href: '#',
          },
          {
            text: 'نرمش',
            href: '#',
          },
          {
            text: 'بسکتبال',
            href: '#',
          },
        ],
        [
          {
            text: 'لباس‌ها',
            href: '#',
          },
          {
            text: 'Compression و Nike Pro',
            href: '#',
          },
          {
            text: 'پیراهن‌های Polo',
            href: '#',
          },
          {
            text: 'لباس‌های کلاه‌دار',
            href: '#',
          },
          {
            text: 'لوازم جانبی',
            href: '#',
            isHeader: true,
          },
          {
            text: 'کوله‌ها و کیف‌ها',
            href: '#',
          },
          {
            text: 'عینک آفتابی',
            href: '#',
          },
        ],
        [
          {
            text: 'لوازم جانبی',
            href: '#',
            isHeader: true,
          },
          {
            text: 'کوله‌ها و کیف‌ها',
            href: '#',
          },
          {
            text: 'عینک آفتابی',
            href: '#',
          },
        ]
      ],
      leftColumn: [
        [
          {
            text: 'با برند',
            href: '#',
          },
          {
            text: 'Nike',
            href: '#',
          },
          {
            text: 'Converse',
            href: '#',
          },
          {
            text: 'Hurley',
            href: '#',
          },
          {
            text: 'Nike Jordan',
            href: '#',
          },
          {
            text: 'The North Face',
            href: '#',
          },
          {
            text: 'Timberland',
            href: '#',
          },
          {
            text: 'Polo Ralph Lauren',
            href: '#',
          },
        ],
        [
          {
            text: 'با ورزش',
            href: '#',
          },
          {
            text: 'دو',
            href: '#',
          },
          {
            text: 'فوتبال',
            href: '#',
          },
        ],
      ],
    },
    womenMenu: {},
    boysMenu: {},
    girlsMenu: {
    },
    fullPanels: [],
    halfPanels: [],
    quarterPanels: [],
  };

  constructor(private router: Router) { }

  ngOnInit() {
  }

  showList(type) {
    setTimeout(() => {
      this.hiddenGenderMenu = false;
      this.selected[type] = true;
      this.menu = this.placements[type + 'Menu'];
    }, 100);
  }

  countDownHideList() {
    setTimeout(() => {
      if (!this.persistedList) {
        this.hideList();
      }
    }, 100);
  }

  searchFocused() {
    this.searchIsFocused = true;
  }

  searchUnfocused() {
    this.searchIsFocused = false;
  }

  persistList() {
    this.persistedList = true;
  }

  hideList() {
    this.hiddenGenderMenu = true;
    this.persistedList = false;
    for (const i in this.selected) {
      if (this.selected.hasOwnProperty(i)) {
        this.selected[i] = false;
      }
    }
  }

  goToRoot() {
    this.router.navigate(['']);
  }
}
