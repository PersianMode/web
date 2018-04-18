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
  constructor(private authService: AuthService, private router: Router, private profileOrderService: ProfileOrderService) {
  }

  ngOnInit() {
  }
}

