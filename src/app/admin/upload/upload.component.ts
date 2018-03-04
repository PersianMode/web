import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  Success($event: Event) {

    this.snackBar.open('File is uploaded successfully', null, {
      duration: 2000,
    });

  }
}
