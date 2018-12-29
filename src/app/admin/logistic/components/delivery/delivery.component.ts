import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  @Output() OnUnassignedInternalDeliveryCount = new EventEmitter();

  constructor() {}

  ngOnInit() {
  }

  OnUnassignedDeliveryChanged($event) {
    this.OnUnassignedInternalDeliveryCount.emit($event);
  }
}
