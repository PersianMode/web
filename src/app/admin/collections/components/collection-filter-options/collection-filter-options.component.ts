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
  filter_options$: any = null;
  filter_options: any = [];

  @Input()
  set tagArray(value) {
    if (value && value.length)
      this.changeFilterOptions();
  }

  @Input()
  set typeArray(value) {
    if (value && value.length)
      this.changeFilterOptions();
  }

  constructor(private router: Router, private httpService: HttpService, private progressService: ProgressService,
              private snackBar: MatSnackBar, private productService: ProductService) {
  }

  async ngOnInit() {
    this.filter_options = await this.getFilterOptionList();
  }

  // async getFilterOptionList() {
  //   this.progressService.enable();
  //   await this.httpService.get(`collection/filter_option_list/${this.collectionId}`).subscribe( res => {
  //     if (res && res.length) {
  //       this.filter_options = res;
  //     }
  //     this.progressService.disable();
  //   }, err => {
  //     this.snackBar.open('Couldn\'t get collection filter option list.', null, {
  //       duration: 3200
  //     });
  //     this.progressService.disable();
  //   });
  // }


  getFilterOptionList() {
    return new Promise((resolve, reject) => {
      this.httpService.get(`collection/filter_option_list/${this.collectionId}`).subscribe(
        (res) => {
          // if (res && res.length) {
          //   this.filter_options = res;
          // }
          resolve(res);
        },
        (err) => {
          this.snackBar.open('Couldn\'t get collection filter option list.', null, {
            duration: 3200
          });
          this.progressService.disable();
          reject(err);
        }
      );
    });
  }

  async changeFilterOptions() {
    let tempArr;
    this.filter_options = await this.getFilterOptionList();
    this.productService.loadCollectionProducts(this.collectionId, null);
    this.filter_options$ = this.productService.filtering$.subscribe(async r => {
      tempArr = r.map(el => {
        return {name: el.name, name_fa: el.name_fa, checked: true};
      });
      if (tempArr) {
        if (this.filter_options && this.filter_options.length) {
          tempArr.forEach(item => {
            let tempItem = null;
            if (tempItem = this.filter_options.find(el => el.name === item.name && el.name_fa === item.name_fa)) {
              item.checked = tempItem.checked;
            }
          });
        }
        this.filter_options = tempArr;
      }

      await this.saveChangesToCollectionInfo();
    });
  }

  setCheckedValue(selectedOption) {
    this.filter_options.filter(el => el.name === selectedOption.name && el.name_fa === selectedOption.name_fa)[0].checked = !selectedOption.checked;
  }

  async saveChangesToCollectionInfo() {
    await this.httpService.post(`collection/filter_option_list/${this.collectionId}`, {filter_option_list: this.filter_options}).subscribe(
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
