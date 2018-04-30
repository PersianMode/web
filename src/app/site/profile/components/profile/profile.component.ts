import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {ProfileOrderService} from '../../../../shared/services/profile-order.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isEdit = false;
  headerTitle;
  constructor(private authService: AuthService, private router: Router, private profileOrderService: ProfileOrderService) {
  }

  ngOnInit() {
    this.authService.isLoggedIn.filter(r => r).subscribe(() => { // on logout
      if (!this.authService.userIsLoggedIn())
        this.router.navigate(['/']);
    });
  }
  setHeaderTitle(title) {
    this.headerTitle = title;
  }
}

