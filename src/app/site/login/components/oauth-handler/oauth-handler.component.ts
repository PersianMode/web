import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from '../../../../shared/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {WINDOW} from '../../../../shared/services/window.service';
import {MatDialog} from '@angular/material';
import {GenDialogComponent} from '../../../../shared/components/gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../../../shared/enum/dialog.components.enum';
import {LoginStatus} from '../login/login.component';

const expiredLinkStatusCode = 437;

@Component({
  selector: 'app-oauth-handler',
  templateUrl: './oauth-handler.component.html',
  styleUrls: ['./oauth-handler.component.css']
})
export class OauthHandlerComponent implements OnInit {
  dialogEnum = DialogEnum;

  isFromActivationLink = false;
  isValidActivationLink = true;

  constructor(private authService: AuthService, private router: Router,
              @Inject(WINDOW) private window, public dialog: MatDialog,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      return new Promise((resolve, reject) => {
        // first check if we're sent from an activation link or not
        if (params['link']) {
          return this.authService.activateEmail(params['link'])
            .then(data => resolve(data))
            .catch(err => reject(err));
        }
        resolve(false);
      })
        .then(res => {
          if (res) {
            this.isFromActivationLink = true;
          }
        })
        .catch(err => {
          if (err && err.status === expiredLinkStatusCode) {
            this.isValidActivationLink = false;
          } else {
            console.error('error in activating via link: ', err);
          }
        })
        .then(res => {
          return this.authService.checkValidation(this.router.url);
        })
        .then(res => {
          // now continue the usual process
          return new Promise((innerResolve, innerReject) => {
            this.authService.isVerified.subscribe(
              (data) => {
                if (!data) {
                  return innerReject('oath-handler::authService->isVerified is false');
                } else {
                  this.router.navigate(['/home']);
                }
              }
            );
          });
        })
        .catch(err => {
          console.error('error: ', err);
          if (this.window.innerWidth >= 960) {
            const rmDialog = this.dialog.open(GenDialogComponent, {
              width: '500px',
              data: {
                componentName: this.dialogEnum.login,
                extraData: {
                  loginStatus: this.isFromActivationLink ? LoginStatus.ActivatingLink :
                    (!this.isValidActivationLink ? LoginStatus.InvalidLink : LoginStatus.Login)
                }
              }
            });
            rmDialog.afterClosed().subscribe(data => {
              if (data)
                this.router.navigate(['home']);
            });
          } else {
            this.router.navigate(['login']);
          }
        });
    });
  }
}
