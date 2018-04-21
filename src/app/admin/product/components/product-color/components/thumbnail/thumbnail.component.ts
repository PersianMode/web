import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.css']
})
export class ThumbnailComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ThumbnailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {
      console.log('data--->', data);
  }

  ngOnInit() {
    console.log('data', this.data);
  }

}
