import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {TitleService} from '../../shared/services/title.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  constructor(private snackBar: MatSnackBar,private titleService :TitleService) { }

  ngOnInit() {
    this.titleService.setTitleWithOutConstant('ادمین: بارگذاری فایل');
  }

  Success($event: Event) {

    this.snackBar.open('File is uploaded successfully', null, {
      duration: 2000,
    });

  }
}
