import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {PageService} from '../../services/page.service';

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
  menu: any = {};
  placements: any = {};
  topMenu = [];

  constructor(private router: Router, private pageService: PageService) {
  }

  ngOnInit() {
    this.pageService.placement$.filter(r => r[0] === 'menu').map(r => r[1]).subscribe(
      data => {
        this.topMenu = data.filter(r => r.variable_name === 'topMenu');
        this.topMenu
          .sort((x, y) => x.info.column - y.info.column)
          .forEach(r => {
            r.routerLink = ['/'].concat(r.info.href.split('/'));
            r.type = r.info.section ? r.info.section : r.routerLink[2];
          });
        const subMenu = data.filter(r => r.variable_name === 'subMenu');
        const sections = Array.from(new Set(subMenu.map(r => r.info.section)));
        this.placements = {};
        sections.forEach(s => {
          subMenu
            .filter(r => r.info.section === s)
            .sort((x, y) => (x.info.column * 100 + x.info.row) - (y.info.column * 100 + y.info.row))
            .forEach(r => {
              const path = r.info.section.split('/');
              r.info.routerLink = ['/'].concat(r.info.href.split('/'));
              if (!this.placements[path[0] + 'Menu']) {
                this.placements[path[0] + 'Menu'] = {};
              }
              if (!this.placements[path[0] + 'Menu'][path[1] + 'List']) {
                this.placements[path[0] + 'Menu'][path[1] + 'List'] = {};
              }
              if (!this.placements[path[0] + 'Menu'][path[1] + 'List'][r.info.column])
                this.placements[path[0] + 'Menu'][path[1] + 'List'][r.info.column] = [];

              this.placements[path[0] + 'Menu'][path[1] + 'List'][r.info.column].push(r.info);
            });
        });
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

  getKeyList(list) {
    return Object.keys(list);
  }
}
