import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProgressService} from '../../../../shared/services/progress.service';
import {HttpService} from '../../../../shared/services/http.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-collection-tag',
  templateUrl: './collection-tag.component.html',
  styleUrls: ['./collection-tag.component.css']
})
export class CollectionTagComponent implements OnInit {
  @Input() collectionId: string;
  tags: any[] = [];

  constructor(private router: Router, private httpService: HttpService, private progressService: ProgressService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.progressService.enable();
    this.httpService.get(`collection/tag/${this.collectionId}`).subscribe(res => {

      if (res && res.tags)
        this.tags = res.tags;
      this.progressService.disable();
    }, err => {
      this.snackBar.open('Couldn\'t get collection products.', null, {
        duration: 3200
      });
      this.progressService.disable();
    });
  }


  addTag(expObj) {
    this.httpService.post(`collection/tag/${this.collectionId}`, {tagId: expObj._id}).subscribe(
      data => {
        this.tags.push(expObj);
        this.progressService.disable();
        this.snackBar.open('tag added to collection.', null, {
          duration: 3200
        });
      }, err => {
        this.snackBar.open('Couldn\'t add tag to collection.', null, {
          duration: 3200
        });
        this.progressService.disable();
      }
    );
  }


  viewTag(tid) {
    this.router.navigate([`agent/tags/${tid}`]);
  }

  removeTag(tid) {
    this.httpService.delete(`collection/tag/${this.collectionId}/${tid}`).subscribe(
      (data) => {
        this.tags = this.tags.filter(x => x._id !== tid);
        this.progressService.disable();
        this.snackBar.open('tag removed to collection successfully.', null, {
          duration: 3200
        });
      }, err => {
        this.progressService.disable();
        this.snackBar.open('could not remove tag to collection.', null, {
          duration: 3200
        });
      }
    );
  }
}
