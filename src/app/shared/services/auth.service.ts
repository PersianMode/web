import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpService} from './http.service';
import {ActivatedRoute, NavigationEnd, Router, RouterStateSnapshot} from '@angular/router';
import {AccessLevel} from '../enum/accessLevel.enum';

@Injectable()
export class AuthService {
  private defaultDisplayName = 'Anonymous user';
  accessLevel = AccessLevel;
  isLoggedIn: ReplaySubject<boolean> = new ReplaySubject(1);
  userDetails = {
    isAgent: null,
    accessLevel: null,
    userId: null,
    displayName: this.defaultDisplayName,
  };

  constructor(private httpService: HttpService, private router: Router) {
  }

  checkValidation(url) {
    return new Promise((resolve, reject) => {
      this.httpService.get((url.includes('agent') ? 'agent/' : '') + 'validUser').subscribe(
        (data) => {
          data = data.body;
          this.isLoggedIn.next(true);
          this.userDetails = {
            isAgent: (data.personType === 'agent') ? true : false,
            userId: data.pid,
            displayName: data.displayName,
            accessLevel: data.hasOwnProperty('access_level') ? data.access_level : null,
          };

          resolve();
        },
        (err) => {
          this.isLoggedIn.next(false);
          this.userDetails = {
            isAgent: null,
            accessLevel: null,
            userId: null,
            displayName: this.defaultDisplayName,
          };

          reject();
        }
      );
    });
  }

  login(username, password) {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        (this.router.url.includes('agent') ? 'agent/' : '') + 'login', {
          username: username,
          password: password
        }).subscribe(
        (data) => {
          this.isLoggedIn.next(true);
          this.userDetails = {
            isAgent: (data.personType === 'agent') ? true : false,
            userId: data.pid,
            displayName: data.displayName,
            accessLevel: data.hasOwnProperty('access_level') ? data.access_level : null,
          };

          resolve();
        },
        (err) => {
          this.isLoggedIn.next(false);
          console.error('Error in login: ', err);
          this.userDetails = {
            isAgent: null,
            accessLevel: null,
            userId: null,
            displayName: this.defaultDisplayName,
          };

          reject();
        }
      );
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      this.httpService.get('logout').subscribe(
        (data) => {
          // const rt = (this.router.url.includes('admin') ? 'admin/' : '') + 'login';

          this.isLoggedIn.next(false);
          this.userDetails = {
            isAgent: (data.personType === 'agent') ? true : false,
            userId: data.pid,
            displayName: data.displayName,
            accessLevel: data.hasOwnProperty('access_level') ? data.access_level : null,
          };
          // this.router.navigate([rt]);

          resolve();
        },
        (err) => {
          console.error('Cannot logout: ', err);

          reject();
        }
      );
    });
  }

  getAllCollections() {
    return this.httpService.get('collection');
  }

  getOneCollection(id) {
    return this.httpService.get(`collection/${id}`);
  }

  createCollection(values) {
    return this.httpService.put(`collection`, values);
  }

  addProductToCollection(cid, pid) {
    return this.httpService.put(`collection/product/${cid}/${pid}`, {});
  }

  deleteCollection(cid) {
    return this.httpService.delete(`collection/${cid}`);
  }

  deleteProductFromCollection(cid, pid) {
    return this.httpService.delete(`collection/product/${cid}/${pid}`);
  }
}
