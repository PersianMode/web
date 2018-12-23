import {Component, Input, OnInit} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
import {ProductService} from '../../../../shared/services/product.service';
import {PageService} from '../../../../shared/services/page.service';
import {Router} from '@angular/router';
import {DictionaryService} from '../../../../shared/services/dictionary.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  tags = [];
  type = [];
  pageInfo: any[] = [];
  tagGroup = [];
  gender = ['MENS', 'WOMENS', 'KIDS', 'UNISEX'];
  type_fa;
  tag;
  secondAddress;
  thirdAddress;

  constructor(private productService: ProductService, private pageService: PageService, private router: Router,
              private dict: DictionaryService) {
  }

  ngOnInit() {
    this.productService.tag$.subscribe(res => {
      this.tags = res.map(r => r.name);
    });
    this.productService.type$.subscribe(res => {
      if (res) this.type = res.map(r => r.name).filter(el => el);
      this.type_fa = this.dict.translateWord((this.type.length ? this.type[0] : '').toString());
    });

    this.pageService.pageInfo$.subscribe(res => {
      this.pageInfo = res[0];
      this.secondAddress = this.pageInfo.toString().slice(0, this.pageInfo.lastIndexOf('/'));
      this.thirdAddress = this.secondAddress.toString().slice(0, this.secondAddress.lastIndexOf('/'));
    });
  }

  getTagGroupName() {
    this.tagGroup = this.tags.find((t) => this.gender.includes(t));
    return this.tagGroup ? this.dict.translateWord(this.tagGroup.toString()) : '';
  }

  getTagName() {
    this.tag = this.tags.find((t) => !this.gender.includes(t));
    const tag = this.tag ? this.dict.translateWord(this.tag.toString()) : '';
    return tag;
  }

  collectionFirstTag() {
    this.router.navigate([`/${this.pageInfo}`]);
  }

  collectionSecondTag() {
    this.router.navigate([`/${this.secondAddress}`]);
  }

  collectionSecondTypeName() {
    this.router.navigate([`/${this.pageInfo}`]);
  }

  collectionTThirdTagGroup() {
    this.router.navigate([`/${this.thirdAddress}`]);
  }

  collectionThirdTypeName() {
    this.router.navigate([`/${this.secondAddress}`]);
  }

  collectionThirdTag() {
    this.router.navigate([`/${this.pageInfo}`]);
  }
}
