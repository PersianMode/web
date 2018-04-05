import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';
import {AccessLevel} from '../shared/enum/accessLevel.enum';
import {Observable} from 'rxjs/Observable';
import {links} from '../shared/lib/links';

@Injectable()
export class AdminAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    this.authService.checkValidation(state.url);

    return this.authService.isLoggedIn.map((res: boolean) => {
      if (res && this.authService.userDetails.isAgent) {

        const link = links.find(x => state.url.includes(x.address));
        if (link && link.access === this.authService.userDetails.accessLevel)
          return true;
      }
      this.router.navigate(['agent/login']);
      return false;
    });
  }
}
