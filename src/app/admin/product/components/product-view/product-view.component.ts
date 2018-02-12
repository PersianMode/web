import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../../../shared/services/http.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ProgressService} from '../../../../shared/services/progress.service';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {
  product: any = [];
  productId: string = null;
  constructor(private snackBar: MatSnackBar,
              public dialog: MatDialog, private progressService: ProgressService,
              private route: ActivatedRoute,
              private router: Router, private httpService: HttpService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        this.productId = params['id'] ? params['id'] : null;
        if (this.productId) {
          this.progressService.enable();

          this.httpService.get(`/product/${this.productId}`).subscribe(
            (data) => {
              this.product = data.body;
              this.progressService.disable();
            },
            (err) => {
              this.progressService.disable();
              console.error('Cannot get product info. Error: ', err);
            }
          );
        }
      });
  }

}
