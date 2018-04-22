import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {HttpService} from 'app/shared/services/http.service';
import {ProgressService} from 'app/shared/services/progress.service';

@Component({
  selector: 'app-product-color-edit',
  templateUrl: './product-color-edit.component.html',
  styleUrls: ['./product-color-edit.component.css']
})
export class ProductColorEditComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ProductColorEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any, private httpService: HttpService, private progressService: ProgressService) {
  }

  ngOnInit() {

    console.log('-> ', this.data);

  }

}
