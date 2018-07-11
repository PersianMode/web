import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from '../../../../shared/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {WINDOW} from '../../../../shared/services/window.service';
import {MatDialog} from '@angular/material';
import {GenDialogComponent} from '../../../../shared/components/gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../../../shared/enum/dialog.components.enum';
import {LoginStatus} from '../../login-status.enum';

const expiredLinkStatusCode = 437;
const setMobilePage = 'setMobile';
const setPreferencesPage = 'setPreferences';

@Component({
  selector: 'app-oauth-handler',
  templateUrl: './oauth-handler.component.html',
  styleUrls: ['./oauth-handler.component.css']
})
export class OauthHandlerComponent implements OnInit {
  dialogEnum = DialogEnum;

  inlineLogin = false;
  finalLoginStatus: LoginStatus = LoginStatus.Login;
  isFromActivationLink = false;
  isValidActivationLink = true;
  shouldGoToSetMobile = false;
  shouldGoToPreferences = false;

  constructor(private authService: AuthService, private router: Router,
              @Inject(WINDOW) private window, public dialog: MatDialog,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      return new Promise((resolve, reject) => {
        if (params['link']) {
          // if sent from google callback (to set mobile or preferences)
          if (params['link'].toLowerCase() === setMobilePage.toLowerCase()) {
            resolve({method: 'google'});
          } else if (params['link'].toLowerCase() === setPreferencesPage.toLowerCase()) {
            resolve({method: 'preferences'});
          } else {
            // if sent from activation link
            return this.authService.activateEmail(params['link'])
              .then(data => resolve({data, method: 'email'}))
              .catch(err => reject(err));
          }
        } else
          resolve(false);
      })
        .then(res => {
          if (res['method'] === 'email') {
            this.isFromActivationLink = true;
          } else if (res['method'] === 'google') {
            this.shouldGoToSetMobile = true;
          } else if (res['method'] === 'preferences') {
            this.shouldGoToPreferences = true;
          }
        })
        .catch(err => {
          if (err && err.status === expiredLinkStatusCode) {
            this.isValidActivationLink = false;
          } else {
            console.error('error: ', err);
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
                  if (!this.shouldGoToPreferences) {
                    this.returnBack();
                  } else {
                    return innerReject('go to preferences page first!');
                  }
                }
              }
            );
          });
        })
        .catch(err => {
          console.error('error: ', err);
          this.finalLoginStatus = this.shouldGoToSetMobile ? LoginStatus.SetMobileNumber :
            (this.shouldGoToPreferences ? LoginStatus.PreferenceTags :
              (this.isFromActivationLink ? LoginStatus.ActivatingLink :
                (!this.isValidActivationLink ? LoginStatus.InvalidLink : LoginStatus.Login)));

          if (this.window.innerWidth >= 960) {
            const rmDialog = this.dialog.open(GenDialogComponent, {
              width: '500px',
              data: {
                componentName: this.dialogEnum.login,
                extraData: {
                  loginStatus: this.finalLoginStatus
                }
              }
            });
            rmDialog.afterClosed().subscribe(data => {
              if (data)
                this.returnBack();
            });
          } else {
            this.inlineLogin = true;
          }
        });
    });
  }

  returnBack() {
    this.router.navigate(['home']);
  }
}
