import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from '../../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {WINDOW} from '../../../../shared/services/window.service';
import {MatDialog} from '@angular/material';
import {GenDialogComponent} from '../../../../shared/components/gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../../../shared/enum/dialog.components.enum';

@Component({
  selector: 'app-oauth-handler',
  templateUrl: './oauth-handler.component.html',
  styleUrls: ['./oauth-handler.component.css']
})
export class OauthHandlerComponent implements OnInit {
  dialogEnum = DialogEnum;

  constructor(private authService: AuthService, private router: Router,
              @Inject(WINDOW) private window, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.authService.checkValidation(this.router.url)
      .then(() => {
        this.authService.isVerified.subscribe(
          (data) => {
            this.router.navigate(['/home']);
            if (!data) {
              this.dialog.open(GenDialogComponent, {
                width: '500px',
                data: {
                  componentName: this.dialogEnum.oauthOtherDetails,
                }
              });
            }
          }
        );
      })
      .catch(err => {
        if (this.window.innerWidth >= 960)
          this.dialog.open(GenDialogComponent, {
            width: '500px',
            data: {
              componentName: this.dialogEnum.login,
            }
          });
        else
          this.router.navigate(['login']);
      });
  }
}
