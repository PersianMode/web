import {Component, OnInit, Inject} from '@angular/core';
import {HttpService} from '../../../../../shared/services/http.service';
import {MatSnackBar, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-upload-image-dialog',
  templateUrl: './upload-image-dialog.component.html',
  styleUrls: ['./upload-image-dialog.component.css']
})
export class UploadImageDialogComponent implements OnInit {

  constructor(private httpService: HttpService, private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UploadImageDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
  }

  imageUploadUrl() {

  }

  imageUploaded(data) {

  }
}
