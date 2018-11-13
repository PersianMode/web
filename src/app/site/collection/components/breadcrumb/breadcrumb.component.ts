import {Component, Input, OnInit} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
import {ProductService} from '../../../../shared/services/product.service';
import {PageService} from '../../../../shared/services/page.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  tags: any[] = [];
  types: any[] = [];
  pageInfo: any[] = [];
  tagGroup: any[] = [];

  constructor(private productService: ProductService, private pageService: PageService) { }

  ngOnInit() {
    this.productService.tag$.subscribe(res => {
      this.tags = res;
      console.log('tagssss', this.tags);
    });
    this.productService.type$.subscribe(res => {
      this.types = res;
      console.log('typesssss', this.types);
    });

    this.pageService.pageInfo$.subscribe(res => {
      this.pageInfo = res[0];
      console.log('pageInfo', this.pageInfo);
    });
  }

}
