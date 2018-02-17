import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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
  productId : string;
  product: any = {};

  constructor(private httpService: HttpService, private snackBar: MatSnackBar,
              private route: ActivatedRoute, private router: Router,
              public dialog: MatDialog, private progressService: ProgressService) {
  }

  setProductId($event) {
    this.productId = $event;
  }

  ngOnInit() {
  }
  ngOnDestroy() {
  }
}
