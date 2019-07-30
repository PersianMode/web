import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProgressService} from '../../../../shared/services/progress.service';
import {HttpService} from '../../../../shared/services/http.service';
import {MatSnackBar} from '@angular/material';
import {ProductService} from '../../../../shared/services/product.service';

@Component({
  selector: 'app-collection-filter-options',
  templateUrl: './collection-filter-options.component.html',
  styleUrls: ['./collection-filter-options.component.css']
})
export class CollectionFilterOptionsComponent implements OnInit {
  @Input() collectionId: string;
  filter_options$: any;
  filter_options: any;
  products = [];
  checkedOptions: any = null;

  constructor(private router: Router, private httpService: HttpService, private progressService: ProgressService,
              private snackBar: MatSnackBar, private productService: ProductService) {
  }

  ngOnInit() {
    this.productService.loadCollectionProducts(this.collectionId, null);

    this.productService.productList$.subscribe(r => {
      this.products = r;
    });

    this.filter_options$ = this.productService.filtering$.subscribe(r => {
      this.filter_options = r;
    });
  }

  saveChangesToCollectionInfo() {

  }
}
