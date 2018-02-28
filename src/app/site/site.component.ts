import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {WINDOW} from '../shared/services/window.service';
import {AuthService} from '../shared/services/auth.service';
import {Router} from '@angular/router';
import {PlacementService} from '../shared/services/placement.service';


@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {
  curWidth = 100;
  curHeight = 100;

  constructor(@Inject(WINDOW) private window, private authService: AuthService,
              private router: Router, private placementService: PlacementService) {
  }

  ngOnInit() {
    this.curWidth = this.window.innerWidth;
    this.curHeight = this.window.innerHeight;

    this.authService.checkValidation(this.router.url);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if ((this.curWidth >= 960 && event.target.innerWidth < 960) || (this.curWidth < 960 && event.target.innerWidth >= 960)) {
      this.placementService.getPlacements(this.router.url.substring(1));
    }
    this.curWidth = event.target.innerWidth;
    this.curHeight = event.target.innerHeight;
  }
}

