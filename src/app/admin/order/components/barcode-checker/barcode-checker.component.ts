import {Component, OnInit, Inject} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthService} from '../../../../shared/services/auth.service';
import {AccessLevel} from '../../../../shared/enum/accessLevel.enum';
import {MatDialogRef, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {ProgressService} from '../../../../shared/services/progress.service';
import {imagePathFixer} from '../../../../shared/lib/imagePathFixer';
import {count} from 'rxjs/operator/count';

@Component({
  selector: 'app-barcode-checker',
  templateUrl: './barcode-checker.component.html',
  styleUrls: ['./barcode-checker.component.css']
})
export class BarcodeCheckerComponent implements OnInit {

  isOK: boolean;
  barcodeCtrl: FormControl;
  products: any[] = [];

  constructor(private dialogRef: MatDialogRef<BarcodeCheckerComponent>,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private progressService: ProgressService) {}



  ngOnInit() {


    this.barcodeCtrl = new FormControl();

    this.barcodeCtrl.valueChanges.debounceTime(150).subscribe(
      (res) => {
        if (res) {
          this.checkBarcode(res);
          this.barcodeCtrl.setValue('');
        }
      },
      (err) => {
      }
    );
  }
  checkBarcode(barcode) {
    this.progressService.enable();
    this.httpService.post('order/dss/receive', {
      barcode
    }).subscribe(res => {

      this.progressService.disable();
      console.log('-> ', res);
      this.addProduct(barcode, res);

    }, err => {
      this.progressService.disable();
      this.openSnackBar('خطا به هنگام اسکن محصول')
    })


  }

  addProduct(barcode: string, newProduct: any) {
    const foundThumbnail = newProduct.colors.find(x => x._id === newProduct.instance.product_color_id).image.thumbnail;
    const thumbnailURL = imagePathFixer(foundThumbnail, newProduct._id, newProduct.instance.product_color_id);
      this.products.push({
        name: newProduct.name,
        size: newProduct.instance.size,
        thumbnailURL,
        barcode,
        productInstanceId: newProduct.instance._id
      })
  }

  
  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }
  close(){
    this.dialogRef.close();
  }

}

