import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class PlacementService {
  private cache: any = {};
  placement$: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) {
  }

  private emitPlacements(data) {

    const components = Array.from(new Set(data.map(r => r.component_name)));
    const dataSplit = components.map(c => data.filter(r => r.component_name === c));

    components.forEach((c, i) => {
      this.placement$.next([c, dataSplit[i]]);
    });
  }

  getPlacements(pageName) {
    if (this.cache[pageName]) {
      this.emitPlacements(this.cache[pageName]);
    } else {
      this.http.get('assets/test_input_for_menu.json').subscribe(
        (data: any) => {
          this.cache[pageName] = data['placement'];
          this.emitPlacements(this.cache[pageName]);
        }, err => {
          console.log('err: ', err);
        }
      );
    }
  }

}
