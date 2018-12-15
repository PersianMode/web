import {Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {MatSort, MatSnackBar, MatTableDataSource, MatDialog} from '@angular/material';
import {FormControl} from '@angular/forms';

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
