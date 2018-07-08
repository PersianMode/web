import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {IPageInfo} from '../../admin/page/interfaces/IPageInfo.interface';
import {Subject} from 'rxjs/Subject';
import {AuthService} from './auth.service';
import {ActivatedRoute} from '@angular/router';

const defaultComponents = ['menu', 'slider', 'logos', 'footer'];

@Injectable()
export class PageService {
  private cache: any = {};
  private homeComponents: any = {};
  placement$: Subject<any[]> = new Subject<any[]>();
  pageInfo$: Subject<any[]> = new Subject<any[]>();
  private homeWasLoaded = false;

  constructor(private httpService: HttpService, private authService: AuthService,
    private route: ActivatedRoute) {
    route.queryParams.subscribe(params => {
      if (params.hasOwnProperty('preview'))
        this.getPage(`home?preview=&date=` + params.date, false);
      else
        this.getPage('home', false);
    });
  }

  private classifyPlacements(pageName, data) {
    const components = Array.from(new Set(data.map(r => r.component_name)));
    const dataSplit = components.map(c => data.filter(r => r.component_name === c));

    if (pageName === 'home') {
      defaultComponents.forEach(r => {
        this.homeComponents[r] = dataSplit[components.indexOf(r)];
        this.homeWasLoaded = true;
      });
    } else {
      defaultComponents.forEach(r => {
        if (!components.includes(r)) {
          components.push(r);
          dataSplit.push(this.homeComponents[r]);
        }
      });
    }
    return [components, dataSplit];
  }

  private emitPlacements(pageName, placements) {
    let components, dataSplit;
    [components, dataSplit] = placements.placement;
    components.forEach((c, i) => {
      this.placement$.next([c, dataSplit[i]]);
    });
    this.pageInfo$.next([pageName, placements.page_info]);
  }

  getPage(pageName, emit = true) {
    const i = setInterval(() => { // All other pages should wait for initialisation of Home placements
      if (pageName === 'home' || pageName.includes('?preview') || this.homeWasLoaded) {
        clearInterval(i);
        if (!this.cache[pageName]) {
          const originalPageName = pageName;
          pageName = pageName.toLowerCase().includes('?preview') ? pageName.substr(0, pageName.indexOf('?preview')) : pageName;
          const plcDate = originalPageName.toLowerCase().includes('?preview') && originalPageName.toLowerCase().includes('&date=') ?
            originalPageName.toLowerCase().substr(originalPageName.toLowerCase().indexOf('&date=') + 6) :
            null;
          this.httpService.post('page' + (this.authService.userDetails.isAgent ? '/cm/preview' : ''), {
            address: pageName,
            date: plcDate,
          }).subscribe(
            (data: any) => {
              if (data && data.placement && data.placement.length) {
                this.cache[pageName] = {
                  placement: this.classifyPlacements(pageName, data.placement),
                  page_info: data.page_info ? data.page_info : null,
                };
              } else {
                this.cache[pageName] = {
                  placement: [['main'], [[]]],
                  page_info: data && data.page_info ? data.page_info : null,
                };
                defaultComponents.forEach(r => {
                  this.cache[pageName].placement[0].push(r);
                  this.cache[pageName].placement[1].push(this.homeComponents[r]);
                });
              }
              if (emit) {
                this.emitPlacements(pageName, this.cache[pageName]);
              }
            }, err => {
              console.error('err: ', err);
            }
          );
        } else if (emit) {
          this.emitPlacements(pageName, this.cache[pageName]);
        }
      }
    }, 500);
  }

  getFilterOptions() {
  }

}
