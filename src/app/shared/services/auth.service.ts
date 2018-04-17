import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpService} from './http.service';
import {Router} from '@angular/router';
import {SocketService} from './socket.service';

@Injectable()
export class AuthService {
  private defaultDisplayName = 'Anonymous user';
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isVerified: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userDetails: any;
  warehouses: any[] = [];


  constructor(private httpService: HttpService, private router: Router, private socketService: SocketService) {
    this.populateUserDetails();
    this.getWarehouses();
  }

  checkValidation(url) {
    return new Promise((resolve, reject) => {
      const tempUrl = url.toLowerCase();

      this.httpService.get((tempUrl.includes('agent') || tempUrl.includes('?preview') ? 'agent/' : '') + 'validUser').subscribe(
        (data) => {
          this.populateUserDetails(data);
          this.isLoggedIn.next(true);
          this.isVerified.next(data.is_verified ? data.is_verified : false);

          if (this.userDetails.warehouse_id) {
            this.socketService.init(this.userDetails.warehouse_id);
          }
          resolve();
        },
        (err) => {
          this.populateUserDetails();
          this.isLoggedIn.next(false);
          reject();
        });

    });
  }

  private populateUserDetails(data = null) {
    if (data) {
      this.userDetails = data;
      Object.assign(this.userDetails, {
        isAgent: data.personType === 'agent',
        userId: data.id,
        displayName: data.name + ' ' + data.surname,
        accessLevel: data.hasOwnProperty('access_level') ? data.access_level : null,
      });
    } else {
      this.userDetails = {
        isAgent: null,
        accessLevel: null,
        userId: null,
        displayName: this.defaultDisplayName,
        username: null,
        name: null,
        surname: null,
        mobile_no: null,
        national_id: null,
        warehouse_id: null,
        socket_token: null
      };
    }
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
          this.populateUserDetails(data);
          this.isLoggedIn.next(true);
          this.isVerified.next(data.is_verified ? data.is_verified : false);
          if (this.userDetails.warehouse_id) {
            this.socketService.init(this.userDetails.warehouse_id);
          }
          resolve();
        },
        (err) => {
          this.isLoggedIn.next(false);
          this.isVerified.next(false);
          console.error('Error in login: ', err);
          this.populateUserDetails();
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
          this.populateUserDetails();
          // this.router.navigate([rt]);
          this.socketService.disconnect();
          resolve();
        },
        (err) => {
          console.error('Cannot logout: ', err);

          reject();
        }
      );
    });
  }

  private getWarehouses() {
    this.httpService.get('warehouse/all').subscribe(res => {
      this.warehouses = res;
    });
  }
}
