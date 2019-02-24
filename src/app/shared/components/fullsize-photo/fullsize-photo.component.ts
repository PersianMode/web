import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-fullsize-photo',
  templateUrl: './fullsize-photo.component.html',
  styleUrls: ['./fullsize-photo.component.css']
})
export class FullsizePhotoComponent implements OnInit {
  @Input() data;
  @Output() closeDialog = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  onClose() {
    this.closeDialog.next();
  }
}
