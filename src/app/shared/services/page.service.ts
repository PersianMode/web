import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {IPageInfo} from '../../admin/page/interfaces/IPageInfo.interface';

const defaultComponents = ['menu', 'slider', 'logos'];

@Injectable()
export class PageService {
  private cache: any = {};
  private homeComponents: any = {};
  placement$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  pageInfo$: ReplaySubject<IPageInfo> = new ReplaySubject<IPageInfo>(1);

  constructor(private httpService: HttpService) {
    this.getPage('home', false);
  }

  private classifyPlacements(pageName, data) {
    const components = Array.from(new Set(data.map(r => r.component_name)));
    const dataSplit = components.map(c => data.filter(r => r.component_name === c));

    if (pageName === 'home') {
      defaultComponents.forEach(r => {
        this.homeComponents[r] = dataSplit[components.indexOf(r)];
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

  private emitPlacements(placements) {
    let components, dataSplit;
    [components, dataSplit] = placements.placement;
    components.forEach((c, i) => {
      this.placement$.next([c, dataSplit[i]]);
    });
    this.pageInfo$.next(placements.page_info);
  }

  getPage(pageName, emit = true) {
    const i = setInterval(() => { // All other pages should wait for initialisation of Home placements
      if (pageName === 'home' || this.homeComponents.menu) {
        clearInterval(i);
        if ( !this.cache[pageName]) {
          this.httpService.post('page', {address: pageName}).subscribe(
            (data: any) => {
              if (data && data.placement) {
                this.cache[pageName] = {
                  placement: this.classifyPlacements(pageName, data.placement),
                  page_info: data.page_info
                };
              } else {
                this.cache[pageName] = {placement: [['main'], [[]]]};
                defaultComponents.forEach(r => {
                  this.cache[pageName].placement[0].push(r);
                  this.cache[pageName].placement[1].push(this.homeComponents[r]);
                });
              }
              if (emit) {
                this.emitPlacements(this.cache[pageName]);
              }
            }, err => {
              console.log('err: ', err);
            }
          );
        } else if (emit) {
          this.emitPlacements(this.cache[pageName]);
        }
      }
    }, 500);
  }
  getFilterOptions() {
  }

}
