import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';
import {Observable} from 'rxjs/Observable';
import {links} from '../shared/lib/links';

@Injectable()
export class AuthGuard implements CanActivate {
  forbiddenStack: any[] = [];

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    this.authService.isLoggedIn.filter(r => r && !!this.forbiddenStack.length)
      .subscribe(() => {
        const lastPage = this.forbiddenStack.pop();
        const curTime: any = new Date();
        if (curTime - lastPage.time < 500) {
          this.router.navigate(lastPage.path);
        } else {
          this.forbiddenStack = [];
        }
      });

    return this.authService.isLoggedIn.map(r => {
      if (!r) {
        this.router.navigate(['/']);
        this.forbiddenStack.push({path: route.url.map(u => u.path), time: new Date()});
      }
      return r;
    });
  }
}
