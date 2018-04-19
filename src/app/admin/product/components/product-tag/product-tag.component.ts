import {Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges} from '@angular/core';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';

@Component({
  selector: 'app-product-tag',
  templateUrl: './product-tag.component.html',
  styleUrls: ['./product-tag.component.css']
})
export class ProductTagComponent implements OnInit, OnChanges {
  @Input() productTags: any;
  @Input() productId: any;
  @Output() onProductTagsChanged = new EventEmitter<any>();

  ngOnInit() {
  }

  constructor(private dialog: MatDialog, private httpService: HttpService, private snackBar: MatSnackBar) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const tags = [];
    if (this.productTags) {
      this.productTags.forEach(tag => {
          if (tags.filter(x => x.tag_id === tag.tag_id).length === 0) {
            tags.push(tag);
          }
        }
      );
      this.productTags = tags;
    }
  }

  addTag($event: any) {
    if (this.productTags.filter(x => x.tag_id === $event._id).length === 0) {
      this.productTags.push($event);
      this.productTags[this.productTags.length - 1].tag_id = this.productTags[this.productTags.length - 1]._id;
      this.productTags[this.productTags.length - 1]._id = null;


      this.httpService.post(`product/tag/${this.productId}`, {tagId: $event.tag_id}).subscribe(
        (data) => {
          this.snackBar.open('tag added successfully', null, {
            duration: 2000,
          });
        },
        (error) => {
          this.snackBar.open('Cannot add this tag. Please try again', null, {
            duration: 2700
          });
        }
      );

    }
  }

  removeTag(tag_id) {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });
    rmDialog.afterClosed().subscribe((status) => {
      if (status) {
        this.productTags = this.productTags.filter(x => x.tag_id !== tag_id);
        this.httpService.delete(`/product/tag/${this.productId}/${tag_id}`).subscribe(
          (data) => {
            this.snackBar.open('tag deleted successfully', null, {
              duration: 2000,
            });
          },
          (error) => {
            this.snackBar.open('Cannot delete this tag. Please try again', null, {
              duration: 2700
            });
          }
        );
      }
    });
  }
}
