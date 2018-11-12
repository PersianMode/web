import {Component, Input, OnInit} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
import {ProductService} from '../../../../shared/services/product.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  collectionId: String;
  tags: any[] = [];
  types: any[] = [];
  tagGroup: any[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.tagId$.subscribe(res => {
      this.tags = res;
      console.log(res);
    });
  }

}
