import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {PlacementService} from '../../services/placement.service';

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
  // topMenu = [
  //   {
  //     collectionName: 'men',
  //     collectionNameFa: 'مردانه',
  //     collectionRoute: '#',
  //   },
  //   {
  //     collectionName: 'women',
  //     collectionNameFa: 'زنانه',
  //     collectionRoute: '#',
  //   },
  //   {
  //     collectionName: 'girls',
  //     collectionNameFa: 'دخترانه',
  //     collectionRoute: '#',
  //   },
  //   {
  //     collectionName: 'boys',
  //     collectionNameFa: 'پسرانه',
  //     collectionRoute: '#',
  //   },
  //   {
  //     collectionName: 'test',
  //     collectionNameFa: 'test',
  //     collectionRoute: '#',
  //   },
  // ];
  placements: any = {
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
    girlsMenu: {},
    testMenu: {},
    fullPanels: [],
    halfPanels: [],
    quarterPanels: [],
  };

  headerPlacements = [];
  topMenu = [];
  subMenu = [];

  constructor(private router: Router, private placementService: PlacementService) {
  }

  ngOnInit() {
    this.placementService.placement$.filter(r => r[0] === 'menu').map(r => r[1]).subscribe(
      data => {
        this.topMenu = data.filter(r => r.variable_name === 'topMenu');
        this.topMenu.forEach(r => r.type = r.info.href.split('/')[1]);
        const subMenu = data.filter(r => r.variable_name === 'subMenu');
        const sections = Array.from(new Set(subMenu.map(r => r.info.section)));
        this.placements = {};
        sections.forEach(s => {
          subMenu
            .filter(r => r.info.section === s)
            .sort((x, y) => (x.info.column * 100 + x.info.row) - (y.info.column * 100 + y.info.row))
            .forEach(r => {
              const path = r.info.section.split('/');
              if (!this.placements[path[0] + 'Menu']) {
                this.placements[path[0] + 'Menu'] = {};
              }
              if (!this.placements[path[0] + 'Menu'][path[1] + 'List']) {
                this.placements[path[0] + 'Menu'][path[1] + 'List'] = [];
              }
              if (r.info.column > 1 &&
                (!this.placements[path[0] + 'Menu'][path[1] + 'List'][r.info.column - 1] ||
                  !this.placements[path[0] + 'Menu'][path[1] + 'List'][r.info.column - 1].length)) {
                if (r.info.column === 2) {
                  const temp = [];
                  this.placements[path[0] + 'Menu'][path[1] + 'List'].forEach(x => temp.push(x));
                  this.placements[path[0] + 'Menu'][path[1] + 'List'] = [];
                  this.placements[path[0] + 'Menu'][path[1] + 'List'].push(temp);
                }
                this.placements[path[0] + 'Menu'][path[1] + 'List'].push([]);
              }
              if (r.info.column > 1) {
                this.placements[path[0] + 'Menu'][path[1] + 'List'][r.info.column - 1].push(r.info);
              } else {
                this.placements[path[0] + 'Menu'][path[1] + 'List'].push(r.info);
              }
            });
        });
        console.log(this.placements)
      });
    this.placementService.getPlacements('');
  }

  adapterFunction() {
    this.topMenu = [];
    this.headerPlacements.forEach((item) => {
      // check conditions
      if (item.variable_name === 'topMenu') {
        item['collectionName'] = item.info.href.split('/')[1];
        this.topMenu.push(item);
      } else if (item.variable_name === 'subMenu') {
        item['collectionName'] = item.info.section.split('/')[0];
        this.subMenu.push(item);
      }
    });
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
