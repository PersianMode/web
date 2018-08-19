import {Component, Input, OnInit} from '@angular/core';
import { Router} from '@angular/router';
import {ProgressService} from '../../../../shared/services/progress.service';
import {HttpService} from '../../../../shared/services/http.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-collection-type',
  templateUrl: './collection-type.component.html',
  styleUrls: ['./collection-type.component.css']
})
export class CollectionTypeComponent implements OnInit {
  @Input() collectionId: string;
  types: any[] = [];

  constructor(private router: Router, private httpService: HttpService, private progressService: ProgressService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.progressService.enable();
    this.httpService.get(`collection/type/${this.collectionId}`).subscribe(res => {

      if (res && res.types)
        this.types = res.types;
      this.progressService.disable();
    }, err => {
      this.snackBar.open('Couldn\'t type collection products.', null, {
        duration: 3200
      });
      this.progressService.disable();
    });
  }



  viewType(tid) {
    this.router.navigate([`agent/type/${tid}`]);
  }

  removeTag(tid) {
    this.httpService.delete(`collection/type/${this.collectionId}/${tid}`).subscribe(
      (data) => {
        this.types = this.types.filter(x => x._id !== tid);
        this.progressService.disable();
        this.snackBar.open('type added to collection successfully.', null, {
          duration: 3200
        });
      }, err => {
        this.progressService.disable();
        this.snackBar.open('could not add type to collection.', null, {
          duration: 3200
        });
      }
    );
  }

  addType(expObj: any) {
    this.httpService.post(`collection/type/${this.collectionId}`, {typeId: expObj._id}).subscribe(
      data => {
        this.types.push(expObj);
        this.progressService.disable();
        this.snackBar.open('type added to collection.', null, {
          duration: 3200
        });
      }, err => {
        this.snackBar.open('Couldn\'t add type to collection.', null, {
          duration: 3200
        });
        this.progressService.disable();
      }
    );
  }
}
