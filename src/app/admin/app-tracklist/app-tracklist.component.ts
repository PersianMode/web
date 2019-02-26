import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {UploadTrackComponent} from './component/upload-track/upload-track.component';
import {ProgressService} from '../../shared/services/progress.service';
import {HttpService} from '../../shared/services/http.service';
import {DomSanitizer} from '@angular/platform-browser';
import {DragulaService} from 'ng2-dragula';

@Component({
  selector: 'app-app-track-list',
  templateUrl: './app-tracklist.component.html',
  styleUrls: ['./app-tracklist.component.css']
})
export class AppTrackListComponent implements OnInit {

  fieldBag = 'field-bag';
  warehouse = [];

  uploadTrackDialog: MatDialogRef<UploadTrackComponent, any>;
  constructor(private httpService: HttpService,
              private sanitizer: DomSanitizer, private dialog: MatDialog,
              private progressService: ProgressService, private snackBar: MatSnackBar, private dragulaService: DragulaService){}

  ngOnInit() {

    if (!this.dragulaService.find(this.fieldBag)) {
      this.dragulaService.setOptions(this.fieldBag, {
        direction: 'veritcal',
        copy: false,
      });

      this.dragulaService.dropModel.subscribe(value => {
        console.log(this.warehouse);

        this.warehouse.forEach(el => {
          el.priority = this.warehouse.indexOf(el);
        });
        console.log(this.warehouse[0]);
      });
    }
    this.getTrackInfo();
  }

  openUploadTrackDialog() {
    this.uploadTrackDialog = this.dialog.open(UploadTrackComponent, {
      width: '700px',
      height: '600px',
      autoFocus: false,
    });
  }

  getTrackInfo() {
    this.progressService.enable();
    this.httpService.get('warehouse/all').subscribe(
      data => {

        this.warehouse = data;

        this.warehouse.sort((a, b) => {
          return a.priority - b.priority
        })

        console.log(this.warehouse);
        this.progressService.disable();
      },
      err => {
        this.progressService.disable();
        console.error('Cannot get warehouses ', err);
        this.snackBar.open('قادر به دریافت اطلاعات انبار ها نیستیم. دوباره تلاش کنید', null, {
          duration: 3200,
        });
      }
    );
  }

  update() {
    this.progressService.enable();
    console.log(this.warehouse)
    this.httpService.put('warehouse/update', {warehouses: this.warehouse}).subscribe(
      (res) => {
        this.progressService.disable();
      },
      (err) => {
        console.error('Cannot edit user info: ', err);
        this.progressService.disable();
      }
    );

  }

}

