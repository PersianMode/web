import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';
import {AccessLevel} from '../shared/enum/accessLevel.enum';
import {Observable} from 'rxjs/Observable';
import {links} from '../shared/lib/links';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  forbiddenStack: any[] = [];

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    this.authService.checkValidation(state.url);

    this.authService.isLoggedIn.filter(r => r && !! !!this.forbiddenStack.length)
      .subscribe(() => {
        const lastPage = this.forbiddenStack.pop();
        const curTime: any = new Date();
        if (curTime - lastPage.time < 500) {
          this.router.navigate(['agent/' + lastPage.path]);
        } else {
          this.forbiddenStack = [];
          this.router.navigate(['agent']);
        }
      });

    return this.authService.isLoggedIn.map((res: boolean) => {
      if (!res) {
        this.router.navigate(['agent/login']);
        this.forbiddenStack.push({path: route.url.map(u => u.path), time: new Date()});
      }

      return res;
    });
  }
}
