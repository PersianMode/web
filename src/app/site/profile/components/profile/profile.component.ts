import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {ProfileOrderService} from '../../../../shared/services/profile-order.service';
import {TitleService} from '../../../../shared/services/title.service';
import { GenDialogComponent } from 'app/shared/components/gen-dialog/gen-dialog.component';
import { DialogEnum } from 'app/shared/enum/dialog.components.enum';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isEdit = false;
  headerTitle;
  dialogEnum = DialogEnum;

  constructor(private authService: AuthService, private dialog: MatDialog,
    private router: Router, private profileOrderService: ProfileOrderService, private titleService: TitleService  ) {
  }

  ngOnInit() {
    this.authService.isLoggedIn.filter(r => r).subscribe(() => { // on logout
      if (!this.authService.userIsLoggedIn())
        this.router.navigate(['/']);
      else
        this.titleService.setTitleWithConstant('پروفایل');
    });
  }

  setHeaderTitle(title) {
    this.headerTitle = title;
  }

  goToRefundBank() {
    this.dialog.open(GenDialogComponent, {
      width: '500px',
      data: {
        componentName: this.dialogEnum.refundBank,
      }
    });
  }
}

