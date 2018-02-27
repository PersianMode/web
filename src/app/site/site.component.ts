import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {WINDOW} from '../shared/services/window.service';
import {AuthService} from '../shared/services/auth.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {
  curWidth = 100;
  curHeight = 100;

  constructor(@Inject(WINDOW) private window, private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.curWidth = this.window.innerWidth;
    this.curHeight = this.window.innerHeight;

    this.authService.checkValidation(this.router.url);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.curWidth = event.target.innerWidth;
    this.curHeight = event.target.innerHeight;
  }
}

