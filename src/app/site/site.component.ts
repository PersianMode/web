import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {WINDOW} from '../shared/services/window.service';
import {AuthService} from '../shared/services/auth.service';
import {Router, NavigationEnd} from '@angular/router';
import {PageService} from '../shared/services/page.service';
import {ResponsiveService} from '../shared/services/responsive.service';
import {CartService} from '../shared/services/cart.service';
import {DictionaryService} from '../shared/services/dictionary.service';


@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {
  isMobile = false;
  curWidth: number;
  curHeight: number;
  showSearchREsult = false;

  constructor(@Inject(WINDOW) private window, private authService: AuthService,
              private responsiveService: ResponsiveService,
              private router: Router, private pageService: PageService) {
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });
    this.curWidth = this.window.innerWidth;
    this.curHeight = this.window.innerHeight;
    this.isMobile = this.isMobileCalc();
    this.updateResponsiveService();
    this.authService.checkValidation(this.router.url)
      .then(() => {}).catch(err => console.error(err));
    this.loadInitialPlacements();
    this.onResize(null, this.curWidth, this.curHeight);
  }

  private updateResponsiveService() {
    [this.responsiveService.curWidth, this.responsiveService.curHeight, this.responsiveService.isMobile] =
      [this.curWidth, this.curHeight, this.isMobile];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event, width?, height?) {
    const [w, h] = [event ? event.target.innerWidth : width, event ? event.target.innerHeight : height];
    if (this.curWidth !== w || this.curHeight !== h) {
      [this.curWidth, this.curHeight] = [w, h];
      this.updateResponsiveService();
      this.responsiveService.resize$.next([w, h]);
    }
    if (this.isMobile !== this.isMobileCalc(w, h)) {
      this.responsiveService.switch$.next(this.isMobileCalc(w, h));
      this.isMobile = this.isMobileCalc(w, h);
      this.responsiveService.isMobile = this.isMobile;
      this.loadInitialPlacements();
    }
  }

  private loadInitialPlacements() {
     setTimeout(() => this.pageService.getPage(this.router.url.substring(1)), 100);
  }

  isMobileCalc(width = this.curWidth, height = this.curHeight): boolean {
    return width < 960;
  }
}

