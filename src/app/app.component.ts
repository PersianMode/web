import {Component, OnInit} from '@angular/core';
import {Router, RouteConfigLoadStart, RouteConfigLoadEnd} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loadingRouteConfig: boolean;
  blockedDocument = false;

  constructor (private router: Router) {}

  ngOnInit () {
    this.blockDocument();
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.loadingRouteConfig = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.loadingRouteConfig = false;
      }
    });
  }
  blockDocument() {
    this.blockedDocument = true;
    setTimeout(() => {
      this.blockedDocument = false;
    }, 3000);
  }
}
