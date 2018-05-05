import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {ProfileOrderService} from '../../../../shared/services/profile-order.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isEdit = false;
  headerTitle;

  constructor(private authService: AuthService, private router: Router, private profileOrderService: ProfileOrderService, private titleService: Title) {
  }

  ngOnInit() {
    this.authService.isLoggedIn.filter(r => r).subscribe(() => { // on logout
      if (!this.authService.userIsLoggedIn())
        this.router.navigate(['/']);
      else
        this.titleService.setTitle('پروفایل');
    });
  }

  setHeaderTitle(title) {
    this.headerTitle = title;
  }
}

