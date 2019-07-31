import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProgressService} from '../../../../shared/services/progress.service';
import {HttpService} from '../../../../shared/services/http.service';
import {MatSnackBar} from '@angular/material';
import {ProductService} from '../../../../shared/services/product.service';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';

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
  private _typeArray;

  @Input()
  set tagArray(value) {
    console.log('***', value);
    this.changeFilterOptions('tag');
  }
  @Input()
  set typeArray(value) {
    console.log('@@@', value);
    this._typeArray = value;
    this.changeFilterOptions('type');
  }

  constructor(private router: Router, private httpService: HttpService, private progressService: ProgressService,
              private snackBar: MatSnackBar, private productService: ProductService) {
  }

  ngOnInit() {
    this.progressService.enable();
    this.httpService.get(`collection/filter_option_list/${this.collectionId}`).subscribe(res => {
      if (res && res.length) {
        this.filter_options = res;
      } else {
        this.changeFilterOptions();
      }
      this.progressService.disable();
    }, err => {
      this.snackBar.open('Couldn\'t get collection filter option list.', null, {
        duration: 3200
      });
      this.progressService.disable();
    });
  }

  changeFilterOptions(val = '') {
    this.productService.loadCollectionProducts(this.collectionId, null);
    this.productService.productList$.subscribe(r => {
      this.products = r;
    });
    let filters = [];
    this.filter_options$ = this.productService.filtering$.subscribe(r => {
      filters = r;
    });
    const tempArr = [...filters].map(el => {
      return {name: el.name, name_fa: el.name_fa, checked: true};
    });
    if (!this.filter_options || !this.filter_options.length)
      this.filter_options = tempArr;

    tempArr.forEach(item => {
      let tempItem = null;
      if (tempItem = this.filter_options.find(el => el.name === item.name && el.name_fa === item.name_fa)) {
        item.checked = tempItem.checked;
      }
    });

    this.filter_options = tempArr;
  }

  setCheckedValue(selectedOption) {
    this.filter_options.filter(el => el.name === selectedOption.name && el.name_fa === selectedOption.name_fa)[0].checked = !selectedOption.checked;
  }

  saveChangesToCollectionInfo() {
    this.httpService.post(`collection/filter_option_list/${this.collectionId}`, {filter_option_list: this.filter_options}).subscribe(
      data => {
        this.progressService.disable();
        this.snackBar.open('filter_options added to collection.', null, {
          duration: 3200
        });
      }, err => {
        this.snackBar.open('Couldn\'t add filter options to collection.', null, {
          duration: 3200
        });
        this.progressService.disable();
      }
    );
  }
}
