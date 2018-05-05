import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  constructor(private snackBar: MatSnackBar, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('ادمین : بارگذاری فایل');
  }

  Success($event: Event) {

    this.snackBar.open('File is uploaded successfully', null, {
      duration: 2000,
    });

  }
}
