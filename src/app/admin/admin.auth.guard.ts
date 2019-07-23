import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';
import {AccessLevel} from '../shared/enum/accessLevel.enum';
import {Observable} from 'rxjs';
import {links} from '../shared/lib/links';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  forbiddenStack: any[] = [];

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    this.authService.checkValidation(state.url);

    return this.authService.isLoggedIn
      .filter((data: any) => data)
      .map((data: any) => {
        if (data.username && this.authService.userDetails.isAgent) {
          const link = links.find(x => state.url.includes(x.address));
          if (link && link.access.find(x => +x === +this.authService.userDetails.accessLevel) >= 0)
            return true;
          else {
            this.router.navigate(['agent/login']);
            return false;
          }
        } else {
          {
            this.router.navigate(['agent/login']);
            return false;
          }
        }
      })
  }
}
