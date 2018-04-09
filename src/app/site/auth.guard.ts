import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';
import {Observable} from 'rxjs/Observable';
import {links} from '../shared/lib/links';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authService.isLoggedIn.map(r => {
      if (!r)
        this.router.navigate(['/']);
      return r;
    });
  }
}
