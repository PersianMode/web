import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpService} from './http.service';
import {Router} from '@angular/router';
import {SocketService} from './socket.service';

export const VerificationErrors = {
  notVerified: {
    status: 420,
    error: 'Customer is not verified yet',
  },
  notMobileVerified: {
    status: 421,
    error: 'Customer\'s mobile is not verified yet',
  },
  notEmailVerified: {
    status: 422,
    error: 'Customer\'s email is not verified yet',
  },
};

@Injectable()
export class AuthService {
  private defaultDisplayName = 'Anonymous user';
  isLoggedIn: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  isVerified: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userDetails: any = {};
  tempUserData: any = {};
  warehouses: any[] = [];


  constructor(private httpService: HttpService, private router: Router, private socketService: SocketService) {
    this.populateUserDetails();
    this.getWarehouses();

    this.isLoggedIn.subscribe(data => {
      if (data && Object.keys(data).length > 0) {
        this.tempUserData = {};
      }
    });
  }

  checkValidation(url) {
    return new Promise((resolve, reject) => {
      const tempUrl = url.toLowerCase();

      this.httpService.get((tempUrl.includes('agent') || tempUrl.includes('?preview') ? 'agent/' : '') + 'validUser').subscribe(
        (data) => {
          console.log('data from validUser: ', data);
          this.populateUserDetails(data);
          this.isLoggedIn.next(data);
          this.isVerified.next(!!data.is_verified);

          if (this.userDetails.warehouse_id) {
            this.socketService.init();
          }
          data.username ? resolve() : reject();
        },
        (err) => {
          this.populateUserDetails();
          this.isLoggedIn.next({});

          // on the condition that the user exists but not verified on each aspect
          // better practice to check existence of error message in err.error
          reject(err);
          // Object.keys(VerificationErrors).forEach(ver => {
          //   if (err.status === VerificationErrors[ver].status)
          //     reject(VerificationErrors[ver]);
          // });
          console.error('error in validUser!', err);
          // reject({
          //   status: 403,
          //   error: err
          // });
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
          this.isLoggedIn.next(data);
          this.isVerified.next(data.is_verified ? data.is_verified : false);
          if (this.userDetails.warehouse_id) {
            this.socketService.init();
          }
          resolve();
        },
        (err) => {
          this.isLoggedIn.next({});
          this.isVerified.next(false);
          console.error('Error in login: ', err);
          this.populateUserDetails();
          reject(err);
        }
      );
    });
  }

  activateEmail(link) {
    return new Promise((resolve, reject) => {
      this.httpService.get(`user/activate/link/${link}`).subscribe(
        data => {
          resolve(data);
        }, err => {
          console.error('could not activate via this link: ', err);
          reject(err);
        }
      );
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      this.httpService.get('logout').subscribe(
        (data) => {
          // const rt = (this.router.url.includes('admin') ? 'admin/' : '') + 'login';
          this.isLoggedIn.next({});
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


  public userIsLoggedIn(): boolean {
    const currentState = this.isLoggedIn.getValue();
    return currentState ? currentState && currentState.username : false;
  }
}
