import {Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {PrintService} from '../../../../shared/services/print.service';

@Component({
  selector: 'app-delivery-shelf-code',
  templateUrl: './delivery-shelf-code.component.html',
  styleUrls: ['./delivery-shelf-code.component.css']
})
export class DeliveryShelfCodeComponent implements OnInit {
  shouldPrint = false;
  shelfCode = '--';

  constructor(private dialogRef: MatDialogRef<DeliveryShelfCodeComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private printService: PrintService) {}

  ngOnInit() {
    this.shouldPrint = !this.data.exist;
    this.shelfCode = this.data.shelf_code;

    if (this.shouldPrint)
      this.printShelfCode();
  }

  printShelfCode() {
    this.printService.printShelfCode(this.shelfCode);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
