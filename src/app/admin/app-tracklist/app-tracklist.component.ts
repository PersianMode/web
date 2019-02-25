import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {UploadTrackComponent} from './component/upload-track/upload-track.component';
import {ProductColorEditComponent} from '../product/components/product-color-edit/product-color-edit.component';
import {ProgressService} from '../../shared/services/progress.service';
import {HttpService} from '../../shared/services/http.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-app-track-list',
  templateUrl: './app-tracklist.component.html',
  styleUrls: ['./app-tracklist.component.css']
})
export class AppTrackListComponent implements OnInit {

  uploadTrackDialog: MatDialogRef<UploadTrackComponent, any>;
  constructor(private httpService: HttpService,
              private sanitizer: DomSanitizer, private dialog: MatDialog,
              private progressService: ProgressService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  openUploadTrackDialog() {
    this.uploadTrackDialog = this.dialog.open(UploadTrackComponent, {
      width: '800px',
      height: '640px',
      data: {
        // productId: this.product._id,
      }
    });
  }

}
