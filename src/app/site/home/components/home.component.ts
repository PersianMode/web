import {Component, OnInit} from '@angular/core';
import {PlacementService} from '../../../shared/services/placement.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private placementService: PlacementService) {
  }

  ngOnInit() {
    this.placementService.getPlacements('home');
  }
}
