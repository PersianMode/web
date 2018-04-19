import { Component, HostListener, Inject, Input, OnInit } from '@angular/core';
import { WINDOW } from '../../services/window.service';
import { AuthService } from '../../services/auth.service';
import { PageService } from '../../services/page.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpService } from '../../services/http.service';


@Component({
  selector: 'app-panels',
  templateUrl: './panels.component.html',
  styleUrls: ['./panels.component.css']
})
export class PanelsComponent implements OnInit {
  curWidth = 100;
  curHeight = 100;
  placements: any = [];

  constructor(@Inject(WINDOW) private window, private authService: AuthService,
    private pageService: PageService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.pageService.placement$.filter(r => r[0] === 'main').map(r => r[1]).subscribe(
      data => {
        this.placements = [];
        /* filter by date add be later */
        const infos = [];
        data
          .sort((x, y) => {
            if (x.info.row > y.info.row)
              return 1;
            else if (x.info.row < y.info.row)
              return -1;
            else {
              if (x.info.column > y.info.column)
                return 1;
              else if (x.info.column < y.info.column)
                return -1;
              return 0;
            }
          })
          .forEach(r => infos.push(r.info));
        for (let i = 0; i < infos.length; i++) {
          let numberOfPicture = 1;
          if (infos[i].panel_type === 'half') {
            numberOfPicture = 2;
          } else if (infos[i].panel_type === 'third') {
            numberOfPicture = 3;
          } else if (infos[i].panel_type === 'quarter') {
            numberOfPicture = 4;
          }
          const object: any = {};
          object.type = infos[i].panel_type;
          object.imgs = [];
          for (let j = i; j < i + numberOfPicture; j++) {
            if (infos[j]) {
              object.imgs.push({});
              if (infos[j].topTitle) {
                object.topTitle = infos[i].topTitle;
              }
              if (infos[j].href) {
                object.imgs[j - i].href = '/'.concat(infos[j].href);
              }
              if (infos[j].areas) {
                object.imgs[j - i].areas = infos[j].areas;
              }
              if (infos[j].imgUrl) {
                object.imgs[j - i].imgUrl = this.getUrl(infos[j].imgUrl);
              }
              if (infos[j].subTitle) {
                object.imgs[j - i].subTitle = infos[j].subTitle;
              }
            }
          }
          this.placements.push(object);
          i += numberOfPicture - 1;
        }
      }
    );
    this.curWidth = this.window.innerWidth;
    this.curHeight = this.window.innerHeight;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.curWidth = event.target.innerWidth;
    this.curHeight = event.target.innerHeight;
  }

  getUrl(url) {
    if (url)
      return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + (url[0] === '/' ? url : '/' + url));
  }
}
