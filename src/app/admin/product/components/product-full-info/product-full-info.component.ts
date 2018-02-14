import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProgressService} from '../../../../shared/services/progress.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../../../shared/services/http.service';

@Component({
  selector: 'app-product-full-info',
  templateUrl: './product-full-info.component.html',
  styleUrls: ['./product-full-info.component.css']
})
export class ProductFullInfoComponent implements OnInit, OnDestroy {
  productId: string = null;
  product: any = {};
  loadedValue: any = {};
  constructor(private httpService: HttpService, private snackBar: MatSnackBar,
              private route: ActivatedRoute, private router: Router,
              public dialog: MatDialog, private progressService: ProgressService) { }

  ngOnInit() {
    // this.route.params.subscribe(
    //   (params) => {
    //     this.productId = params['id'];
    //     if (this.productId) {
    //       this.progressService.enable();
    //       this.httpService.get(`/product/${this.productId}`).subscribe(
    //         (data) => {
    //           this.product = data.body[0];
    //           this.loadedValue = data.body[0];
    //           this.progressService.disable();
    //         },
    //         (err) => {
    //           this.progressService.disable();
    //           console.error('Cannot get product info... Error: ', err);
    //         }
    //       );
    //     }
    //   });
  }

  ngOnDestroy() {
    // this.productId = null;
    // this.product = null;
    // this.loadedValue = null;
  }
}
