import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProgressService} from '../../../../shared/services/progress.service';
import {HttpService} from '../../../../shared/services/http.service';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  collectionId: string;
  currentCollection;
  typeIds;
  tagGroupIds;

  types = new FormControl();
  typesList = [
    {_id: '5a7eff46c8b7d92b818f1f08', name: 'shoe'},
    {_id: '5a7f00bdc8b7d92b818f1f0b', name: 'sneakers'},
    {_id: '5a8d276282a1b20d50f28212', name: 'tshirts'},
  ];

  tagGroups = new FormControl();
  tagGroupsList = [
    {_id: '5a8d274a82a1b20d50f2820f', name: 'taggroup1'},
    {_id: '5a8d275382a1b20d50f28210', name: 'taggroup2'},
    {_id: '5a8d275a82a1b20d50f28211', name: 'taggroup3'},
  ];

  constructor(private route: ActivatedRoute, private router: Router,
              private httpService: HttpService, private progressService: ProgressService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        this.collectionId = params['id'] ? params['id'] : null;

        this.currentCollection = [];
        this.searchDetails();
      }
    );
  }

  searchDetails() {
    this.progressService.enable();
    this.httpService.get(`collection/${this.collectionId}`).subscribe(
      (data) => {
        data = data.body[0];
        this.currentCollection = data;
        if (!data.is_smart) {
          this.progressService.disable();
          return;
        }
        this.typeIds = [];
        for (const typeId in data.types) {
          if (data.types.hasOwnProperty(typeId)) {
            this.typeIds.push(data.types[typeId]._id);
          }
        }
        this.tagGroupIds = [];
        for (const tagGroupId in data.tagGroups) {
          if (data.tagGroups.hasOwnProperty(tagGroupId)) {
            this.tagGroupIds.push(data.tagGroups[tagGroupId]._id);
          }
        }
        this.httpService.post(`search/ProductType`, {
          offset: 0,
          limit: 100,
          options: {
            phrase: ''
          }
        }).subscribe(
          product_types => {
            this.typesList = product_types.body;
            this.httpService.post(`search/TagGroup`, {
              offset: 0,
              limit: 100,
              options: {
                phrase: ''
              }
            }).subscribe(
              tag_groups => {
                this.tagGroupsList = tag_groups.body;
                this.progressService.disable();

              }, err => {
                console.log('couldn\'t get tag groups', err);
                this.progressService.disable();
              });
          }, err => {
            console.log('couldn\'t get product types', err);
            this.progressService.disable();
          });
      },
      (err) => {
        console.log('Collection not found! ', err);
        this.progressService.disable();
      });
  }

  addProduct(expObj) {
    this.httpService.put(`collection/product/${this.currentCollection._id}/${expObj._id}`, {}).subscribe(
      data => {
        this.searchDetails();
      }, err => {
        console.log('couldn\'t add product', err);
      }
    );
  }

  addTag(expObj) {
    this.httpService.put(`collection/tag/${this.currentCollection._id}/${expObj._id}`, {}).subscribe(
      data => {
        this.searchDetails();
      }, err => {
        console.log('couldn\'t add tag', err);
      }
    );
  }

  viewProduct(pid) {
    this.router.navigate([`/agent/products/${pid}`]);
  }

  removeProduct(pid) {
    this.httpService.delete(`collection/product/${this.collectionId}/${pid}`).subscribe(
      (data) => {
        this.searchDetails();
      });
  }

  viewTag(tid) {
    this.router.navigate([`agent/tags/${tid}`]);
  }

  removeTag(tid) {
    this.httpService.delete(`collection/tag/${this.collectionId}/${tid}`).subscribe(
      (data) => {
        this.searchDetails();
      }
    );
  }

  updateDetails() {
    this.progressService.enable();
    this.httpService.put(`collection/detail/${this.collectionId}`, {
      typeIds: this.typeIds,
      tagGroupIds: this.tagGroupIds
    }).subscribe(
      data => {
        this.snackBar.open('Details updated', null, {
          duration: 3200
        });
        this.progressService.disable();
      }, err => {
        this.snackBar.open('Couldn\'t update details.', null, {
          duration: 3200
        });
        console.log(err);
        this.progressService.disable();
      }
    );
  }
}
