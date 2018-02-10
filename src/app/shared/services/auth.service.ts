import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpService} from './http.service';
import {NavigationEnd, Router, RouterStateSnapshot} from '@angular/router';
import {AccessLevel} from '../enum/accessLevel.enum';

@Injectable()
export class AuthService {
  private defaultDisplayName = 'Anonymous user';
  isLoggedIn: ReplaySubject<boolean> = new ReplaySubject(1);
  isAgent: ReplaySubject<boolean> = new ReplaySubject(1);
  accessLevel: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  userId: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  displayName: BehaviorSubject<string> = new BehaviorSubject<string>(this.defaultDisplayName);

  constructor(private httpService: HttpService, private router: Router, private routerState: RouterStateSnapshot) {
    console.log(this.router);

    console.log(this.routerState.url);

    this.router.events.subscribe(
      (dt) => {
        console.log('Event: ', dt);

        if (dt instanceof NavigationEnd) {
          this.httpService.get((this.router.url.includes('agent') ? 'agent/' : '') + 'validUser').subscribe(
            (data) => {
              this.isLoggedIn.next(true);
              this.isAgent.next((data.personType === 'agent') ? true : false);
              this.userId.next(data.pid);
              this.displayName.next(data.displayName);
              if (data.hasOwnProperty('access_level')) {
                this.accessLevel.next(data.acceleration);
              }
            },
            (err) => {
              this.isLoggedIn.next(false);
              this.isAgent.next(false);
              this.userId.next(null);
              this.displayName.next(this.defaultDisplayName);
              this.accessLevel.next(null);
            }
          );
        }
      }
    );
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
          this.isAgent.next((data.personType === 'agent') ? true : false);
          this.userId.next(data.pid);
          this.displayName.next(data.displayName);
          if (data.hasOwnProperty('access_level')) {
            this.accessLevel.next(data.acceleration);
          }
          resolve();
        },
        (err) => {
          this.isLoggedIn.next(false);
          console.error('Error in login: ', err);
          this.isAgent.next(false);
          this.userId.next(null);
          this.displayName.next(this.defaultDisplayName);
          this.accessLevel.next(null);

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
          this.isAgent.next(false);
          this.userId.next(null);
          this.displayName.next(this.defaultDisplayName);
          this.accessLevel.next(null);
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

  loginCheck() {
    return new Promise((resolve, reject) => {
      this.httpService.get('/validUser').subscribe(
        (data) => {
          this.isLoggedIn.next(true);
          if (data.personType === 'agent') {
            this.isAgent.next(true);
          } else {
            this.isAgent.next(false);
          }
          this.userId.next(data.id);
          this.displayName.next(data.displayName);
          resolve();
        },
        (err) => {
          this.isLoggedIn.next(false);
          this.isAgent.next(false);
          this.userId.next(null);
          this.displayName.next(this.defaultDisplayName);
          reject();
        }
      );
    });
  }
}
