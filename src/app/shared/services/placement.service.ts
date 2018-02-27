import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {HttpService} from './http.service';

const defaultComponents = ['menu', 'slider', 'logos'];

@Injectable()
export class PlacementService {
  private cache: any = {};
  private homeComponents: any = {};
  id;
  placement$: Subject<any> = new Subject<any>();

  constructor(private httpService: HttpService) {
    this.getPlacements('home', false);
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
    [components, dataSplit] = placements;
    components.forEach((c, i) => {
      this.placement$.next([c, dataSplit[i]]);
    });
  }

  getPlacements(pageName, emit = true) {
    const i = setInterval(() => { // All other pages should wait for initialisation of Home placements
      if (pageName === 'home' || this.homeComponents.menu) {

        clearInterval(i);
        if (!this.cache[pageName]) {
          this.httpService.post(`page/placement/list`, {address: pageName}).subscribe(
            (data: any) => {

              data = data.placement;
              const key = pageName === 'home' ? 'home' : 'own';
              if (data[key]) {
                this.cache[pageName] = this.classifyPlacements(pageName, data[key]);
              } else {
                this.cache[pageName] = [['main'], [[]]];
                defaultComponents.forEach(r => {
                  this.cache[pageName][0].push(r);
                  this.cache[pageName][1].push(this.homeComponents[r]);
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

}
