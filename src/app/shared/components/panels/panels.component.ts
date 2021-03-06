import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {WINDOW} from '../../services/window.service';
import {AuthService} from '../../services/auth.service';
import {PageService} from '../../services/page.service';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpService} from '../../services/http.service';
import {Router} from '@angular/router';

const paddingObject = marginArray => {
  const temp: any = {};
  ['top', 'right', 'bottom', 'left'].forEach(p => {
    const f = marginArray.find(r => r.pos === 'margin-' + p);
    temp['padding-' + p + '.px'] = f ? +f.title : 0;
  });
  return temp;
};

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
              private pageService: PageService, private sanitizer: DomSanitizer,
              private router: Router) {
  }

  ngOnInit() {
    this.pageService.placement$.filter(r => r[0] === 'main').map(r => r[1]).subscribe(
      data => {
        this.placements = {};
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
          .forEach(r => {
            if (!this.placements[r.info.row])
              this.placements[r.info.row] = {topTitle: null, imgs: []};

            if (r.info.topTitle)
              this.placements[r.info.row].topTitle = r.info.topTitle;

            this.placements[r.info.row].imgs.push({
              href: r.info.href,
              areas: r.info.areas.filter(a => !a.pos.includes('margin')),
              padding: paddingObject(r.info.areas.filter(a => a.pos.includes('margin'))),
              imgUrl: this.getUrl(r.info.imgUrl),
              fileType: r.info.fileType,
              mediaType: this.getFileTypeFromExtension(r.info.fileType && r.info.fileType['ext'], this.getImageLink(r.info.imgUrl)),
              subTitle: r.info.subTitle,
              type: r.info.panel_type,
            });
          });
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

  getRowParts(item) {
    switch (item.type.toLowerCase()) {
      case 'full':
        return 100;
      case 'half':
        return 50;
      case 'third':
        return 33;
      case 'quarter':
        return 25;
    }
  }

  getKeyList(list) {
    return Object.keys(list);
  }

  directToUrl(url) {
    if (url.includes('http')) {
      // this.window.location.replace(url);
      const win = window.open(url, '_blank');
      win.focus();
    } else {
      this.router.navigate([url]);
    }
  }

  getImageLink(link) {
    if (typeof link === 'string')
      return link;
    else if (typeof link === 'object')
      return link['changingThisBreaksApplicationSecurity'];
  }

  getFileTypeFromExtension(ext, url) {
    let imgs = this.pageService.fileTypes['images'].filter(el => el === ext);
    if (imgs.length > 0)
      return 'image';

    let vds = this.pageService.fileTypes['videos'].filter(el => el === ext);
    if (vds.length > 0)
      return 'video';

    // if nothing found, we can only check with the extension!
    if (!url)
      return;

    let extension = url.split('.');
    extension = extension[extension.length - 1];
    // console.log('local extension:', extension);
    imgs = this.pageService.fileTypes['images'].filter(el => el === extension);
    if (imgs.length > 0)
      return 'image';

    vds = this.pageService.fileTypes['videos'].filter(el => el === extension);
    if (vds.length > 0)
      return 'video';

    // default fallback
    return 'image';
  }

}
