import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {WINDOW} from '../../../shared/services/window.service';
import {AuthService} from '../../../shared/services/auth.service';
import {PlacementService} from '../../../shared/services/placement.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  curWidth = 100;
  curHeight = 100;
  placements: any = [];

  constructor(@Inject(WINDOW) private window, private authService: AuthService, private placementService: PlacementService) {
  }

  ngOnInit() {
    this.placementService.placement$.filter(r => r[0] === 'main').map(r => r[1]).subscribe(
      data => {
        /* filter by date add be later */
        const infos = [];
        data.forEach(r => infos.push(r.info));
        for (let i = 0; i < infos.length; i++) {
          let numberOfPicture = 1;
          if (infos[i].panel_type === 'half') {
            numberOfPicture = 2;
          } else if (infos[i].panel_type === 'third') {
            numberOfPicture = 3;
          } else if (infos[i].panel_type === 'quarter') {
            numberOfPicture = 4;
          }
          const object: any = {};
          object.type = infos[i].panel_type;
          object.imgs = [];
          for (let j = i; j < i + numberOfPicture; j++) {
            if (infos[j]) {
              object.imgs.push({});
              if (infos[j].topTitle) {
                object.topTitle = infos[i].topTitle;
              }
              if (infos[j].href) {
                object.imgs[j - i].href = '/'.concat(infos[j].href);
              }
              if (infos[j].areas) {
                object.imgs[j - i].areas = infos[j].areas;
              }
              if (infos[j].imgUrl) {
                object.imgs[j - i].imgUrl = infos[j].imgUrl;
              }
              if (infos[j].subTitle) {
                object.imgs[j - i].subTitle = infos[j].subTitle;
              }
            }
          }
          this.placements.push(object);
          i += numberOfPicture - 1;
        }
      }
    );
    this.placementService.getPlacements('home');
    this.curWidth = this.window.innerWidth;
    this.curHeight = this.window.innerHeight;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.curWidth = event.target.innerWidth;
    this.curHeight = event.target.innerHeight;
  }
}
