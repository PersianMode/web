import {Component, Inject, Input, OnInit} from '@angular/core';
import {WINDOW} from '../../../shared/services/window.service';
import {PageService} from '../../services/page.service';
import {IPlacement} from '../../../admin/page/interfaces/IPlacement.interface';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  curWidth = 100;
  curHeight = 100;
  footer = {};
  placements: any = {};
  footerItems: IPlacement[] = [];
  footerSitelinksItems: any = {};
  footerSiteLinkColumns: any[] = [];
  footerSocilaNetworkItems: any = {};
  footerSocialNetworkColumns: any[] = [];


  getRelatedItems() {
    this.footerSitelinksItems = {};

    this.footerItems.filter(el => {
      if (el.info.section.split('/')[0].toLowerCase() === this.selectedSection.toLowerCase())
        return el;
    }).forEach(el => {
      const column = el.info.column;
          if (!this.footerSitelinksItems[column])
             this.footerSitelinksItems[column] = [];
             this.footerSitelinksItems[column].push(el);
    });

    Object.keys(this.footerSitelinksItems).forEach(el => {
      this.sortColumnItems(this.footerSitelinksItems[el]);
    });

    this.footerSiteLinkColumns = Object.keys(this.footerSitelinksItems);
    if (this.footerSiteLinkColumns.length === 0) {
      this.footerSiteLinkColumns = [0];
      this.footerSitelinksItems = {0: []};
    }
  }

  constructor(@Inject(WINDOW) private window, private pageService: PageService) {
  }

  ngOnInit() {
    this.curWidth = this.window.innerWidth;
    this.curHeight = this.window.innerHeight;

    this.window.onresize = (e) => {
      this.curWidth = this.window.innerWidth;
      this.curHeight = this.window.innerHeight;
    };

    this.pageService.placement$.filter(r => r[0] === 'footer').map(r => r[1]).subscribe(
      data => {});
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
}
