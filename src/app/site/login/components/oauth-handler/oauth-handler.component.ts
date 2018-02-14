import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../../shared/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-oauth-handler',
  templateUrl: './oauth-handler.component.html',
  styleUrls: ['./oauth-handler.component.css']
})
export class OauthHandlerComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.checkValidation(this.router.url)
      .then(res => {
        this.router.navigate(['/home']);
      })
      .catch(err => {
        this.router.navigate(['/login']);
      });
  }
}
