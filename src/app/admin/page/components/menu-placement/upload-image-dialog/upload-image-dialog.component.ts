import {Component, OnInit, Inject} from '@angular/core';
import {HttpService} from '../../../../../shared/services/http.service';
import {MatSnackBar, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-upload-image-dialog',
  templateUrl: './upload-image-dialog.component.html',
  styleUrls: ['./upload-image-dialog.component.css']
})
export class UploadImageDialogComponent implements OnInit {
  placementId = null;
  pageId = null;
  rcvData = null;

  constructor(private httpService: HttpService, private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UploadImageDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.pageId = this.data.pageId;
    this.placementId = this.data.placementId ? this.data.placementId : null;
  }

  imageUploadUrl() {
    if (this.placementId)
      return `placement/image/${this.pageId}/${this.placementId}`;

    return `placement/image/${this.pageId}/null`;
  }

  imageUploaded(data) {
    if (data.length > 0) {
      this.snackBar.open('تصویر بارگذاری شد', null, {
        duration: 2300,
      });

      this.rcvData = {
        downloadURL: this.placementId ? data[0] : data[0].downloadURL,
      };

      if (!this.placementId) {
        this.rcvData['placement_id'] = data[0].placementId;
      }
    } else
      this.snackBar.open('بارگذاری با خطا رو به رو شد. دوباره تلاش کنید', null, {
        duration: 3200,
      });
  }

  getThisPlacement() {
    return {
      component_name: 'menu',
    };
  }

  closeDialog() {
    this.dialogRef.close(this.rcvData);
  }
}
