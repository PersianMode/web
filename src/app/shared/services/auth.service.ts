import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpService} from './http.service';
import {ActivatedRoute, NavigationEnd, Router, RouterStateSnapshot} from '@angular/router';
import {AccessLevel} from '../enum/accessLevel.enum';
import {getExpressionLoweringTransformFactory} from '@angular/compiler-cli/src/transformers/lower_expressions';
import {reject} from 'q';
import {SocketService} from './socket.service';

@Injectable()
export class AuthService {
  private defaultDisplayName = 'Anonymous user';
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isVerified: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userDetails = {
    isAgent: null,
    accessLevel: null,
    userId: null,
    displayName: this.defaultDisplayName,
    username: null,
    name: null,
    surname: null,
    mobile_no: null,
    socket_token: null
  };

  constructor(private httpService: HttpService, private router: Router, private socketService: SocketService) {
  }

  checkValidation(url) {
    return new Promise((resolve, reject) => {
      this.httpService.get((url.includes('agent') ? 'agent' : '') + '/validUser').subscribe(
        (data) => {
          this.userDetails = {
            isAgent: data.personType === 'agent',
            userId: data.id,
            displayName: data.displayName,
            accessLevel: data.hasOwnProperty('access_level') ? data.access_level : null,
            socket_token: data.hasOwnProperty('socket_token') ? data.socket_token : null,
            username: data.username,
            name: data.name,
            surname: data.surname,
            mobile_no: data.mobile_no,
          };
          this.isLoggedIn.next(true);
          this.isVerified.next(data.is_verified ? data.is_verified : false);

          if (this.userDetails.socket_token) {
            this.socketService.init(this.userDetails.socket_token);
          }
          resolve();
        },
        (err) => {
          this.userDetails = {
            isAgent: null,
            accessLevel: null,
            userId: null,
            displayName: this.defaultDisplayName,
            username: null,
            name: null,
            surname: null,
            mobile_no: null,
            socket_token: null,
          };
          this.isLoggedIn.next(false);
          reject();
        });

    });
  }

  login(username, password, loginType = null, warehouse_id = null) {

    const info = {
      username: username,
      password: password,
    };
    if (this.router.url.includes('agent')) {
      info['loginType'] = loginType;
      if (warehouse_id)
        info['warehouse_id'] = warehouse_id;
    }

    return new Promise((resolve, reject) => {
      this.httpService.post(
        (this.router.url.includes('agent') ? 'agent/' : '') + 'login', info).subscribe(
        (data) => {
          this.isLoggedIn.next(true);
          this.isVerified.next(data.is_verified ? data.is_verified : false);
          this.userDetails = {
            isAgent: data.personType === 'agent',
            userId: data.id,
            displayName: data.displayName,
            accessLevel: data.hasOwnProperty('access_level') ? data.access_level : null,
            username: data.username,
            name: data.name,
            surname: data.surname,
            mobile_no: data.mobile_no,
            socket_token: data.hasOwnProperty('socket_token') ? data.socket_token : null,
          };
          if (this.userDetails.socket_token) {
            this.socketService.init(this.userDetails.socket_token);
          }

          resolve();
        },
        (err) => {
          this.isLoggedIn.next(false);
          this.isVerified.next(false);
          console.error('Error in login: ', err);
          this.userDetails = {
            isAgent: null,
            accessLevel: null,
            userId: null,
            displayName: this.defaultDisplayName,
            username: null,
            name: null,
            surname: null,
            mobile_no: null,
            socket_token: null
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
          this.isVerified.next(data.is_verified ? data.is_verified : false);
          this.userDetails = {
            isAgent: null,
            userId: null,
            displayName: this.defaultDisplayName,
            accessLevel: null,
            username: null,
            name: null,
            surname: null,
            mobile_no: null,
            socket_token: null
          };
          this.socketService.disconnect();
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
}
