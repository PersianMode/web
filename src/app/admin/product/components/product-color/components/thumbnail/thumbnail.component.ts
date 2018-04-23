import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpService } from '../../../../../../shared/services/http.service';
import {ProgressService} from '../../../../../../shared/services/progress.service';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.css']
})
export class ThumbnailComponent implements OnInit {

  productColor;
  constructor(private dialogRef: MatDialogRef<ThumbnailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any, private httpService: HttpService, private progressService: ProgressService) {
      this.productColor = data;
  }

  ngOnInit() {
  }

  dataSaved() {
    this.progressService.enable();
    this.httpService.post(`/product/image/${this.productColor._id}/${this.productColor.color_id}`, {}).subscribe(
      (data) => {

        this.progressService.disable();
    },
      (err) => {
        this.progressService.disable();
    });
    this.dialogRef.close();
  }

}
