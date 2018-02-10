import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';
import {AccessLevel} from '../shared/enum/accessLevel.enum';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  accessLevel = AccessLevel;
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authService.isLoggedIn.map((res: boolean) => {
      // if (res && this.authService.isAgent && this.authService.accessLevel.getValue() === this.accessLevel.Admin)
      //   return true;
      //
      // this.router.navigate(['agent/login']);
      // return false;
      return true;
    });
  }
}
