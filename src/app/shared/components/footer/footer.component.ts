import {Component, Inject, Input, OnInit} from '@angular/core';
import {WINDOW} from '../../../shared/services/window.service';
import {PageService} from '../../services/page.service';
import {IPlacement} from '../../../admin/page/interfaces/IPlacement.interface';
import {HttpService} from 'app/shared/services/http.service';
import {filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  curWidth = 100;
  curHeight = 100;
  footerSiteLinksItems: any = {};
  footerSocialNetworkItems: any[] = [];
  bottomMessage = '';

  constructor(@Inject(WINDOW) private window, private pageService: PageService) {
  }

  ngOnInit() {
    this.curWidth = this.window.innerWidth;
    this.curHeight = this.window.innerHeight;

    this.window.onresize = (e) => {
      this.curWidth = this.window.innerWidth;
      this.curHeight = this.window.innerHeight;
    };

    this.pageService.placement$
      .pipe(filter(r => r[0] === 'footer'))
      .pipe(map(r => r[1]))
      .subscribe(
      (data) => {
        if (data) {
          this.setFooterTextLinks(data.filter(el => el.variable_name === 'site_link'));
          this.setFooterSocialLinks(data.filter(el => el.variable_name === 'social_link'));
        }
      },
      (err) => {
        console.error('Cannot get footer placements: ', err);
      }
    );
  }

  setFooterTextLinks(list) {
    this.footerSiteLinksItems = {};
    list.forEach(el => {
      if (!this.footerSiteLinksItems[el.info.column])
        this.footerSiteLinksItems[el.info.column] = [];

      this.footerSiteLinksItems[el.info.column].push({
        text: el.info.text,
        href: el.info.href,
        row: el.info.row,
        is_header: el.info.is_header,
      });
    });

    // Sort items
    Object.keys(this.footerSiteLinksItems).forEach(el => {
      this.footerSiteLinksItems[el].sort((a, b) => {
        if (a.row > b.row)
          return 1;
        else if (a.row < b.row)
          return -1;
        return 0;
      });
    });
    const minKeys = Math.min(...Object.keys(this.footerSiteLinksItems).map(r => +r));
    this.bottomMessage = minKeys && this.footerSiteLinksItems[minKeys] ? this.footerSiteLinksItems[minKeys][this.footerSiteLinksItems[minKeys].length - 1].text : '';
  }

  setFooterSocialLinks(list) {
    this.footerSocialNetworkItems = list.sort((a, b) => {
      if (a.info.column > b.info.column)
        return 1;
      else if (a.info.column < b.info.column)
        return -1;
      return 0;
    }).map(el => {
      return {text: el.info.text + ' icons', href: el.info.href};
    });
  }

  getKeyList(list) {
    return Object.keys(list);
  }

  getDNSNumber() {
    if (HttpService.Host.toLowerCase().includes('bankofstyle'))
      return 1;
    else if (HttpService.Host.toLowerCase().includes('lithium.style'))
      return 2;
  }
}
