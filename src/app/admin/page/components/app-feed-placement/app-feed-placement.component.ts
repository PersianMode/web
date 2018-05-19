import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {IPlacement} from '../../interfaces/IPlacement.interface';
import {HttpService} from '../../../../shared/services/http.service';
import {DragulaService} from 'ng2-dragula';
import {ProgressService} from '../../../../shared/services/progress.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {PlacementModifyEnum} from '../../enum/placement.modify.type.enum';
import {UploadImageDialogComponent} from '../menu-placement/upload-image-dialog/upload-image-dialog.component';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-app-feed-placement',
  templateUrl: './app-feed-placement.component.html',
  styleUrls: ['./app-feed-placement.component.css']
})
export class AppFeedPlacementComponent implements OnInit {
  @Input() pageId = null;
  @Input() canEdit = true;
  @Input()
  set placements(value: IPlacement[]) {
    if (value)
      this.sortingPlacementItems(value);
  }
  @Output() modifyPlacement = new EventEmitter();

  bagName = 'app-feed-bag';
  placementList: IPlacement[] = [];
  feedForm: FormGroup = null;
  selectedItem = null;
  imageUrlAddress = null;
  newPlacementId = null;
  anyChanges = false;

  constructor(private httpService: HttpService, private dragulaService: DragulaService,
    private progressService: ProgressService, private dialog: MatDialog,
    private snackBar: MatSnackBar, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (!this.dragulaService.find(this.bagName))
      this.dragulaService.setOptions(this.bagName, {
        direction: 'vertical',
        moves: function() {
          return this.canEdit;
        }
      });

    this.dragulaService.dropModel.subscribe(value => {
      if (this.bagName === value[0])
        this.changeItemOrder();
    });

    this.initForm();

    this.feedForm.valueChanges.subscribe(
      () => this.fieldChanged()
    );
  }

  initForm() {
    this.feedForm = new FormBuilder().group({
      text: [null, [
        Validators.required,
      ]],
      href: [null, [
        Validators.required,
      ]]
    });
  }

  sortingPlacementItems(list) {
    this.placementList = list.sort((a, b) => {
      if (a.info.row > b.info.row)
        return 1;
      else if (a.info.row < b.info.row)
        return -1;
      return 0;
    });
  }

  changeItemOrder() {
    let rowCounter = 1;
    this.placementList.forEach(placement => {
      placement.info.row = rowCounter;
      rowCounter++;
    });

    this.progressService.enable();
    this.httpService.post('placement', {
      page_id: this.pageId,
      placements: this.placementList,
    }).subscribe(
      (data: any) => {
        this.modifyPlacement.emit({
          type: PlacementModifyEnum.Modify,
          placements: this.placementList,
        });
        this.progressService.disable();
      },
      (err) => {
        console.error('Cannot update order of items: ', err);
        this.progressService.disable();
      }
    );
  }

  modifyItem() {
    this.progressService.enable();
    (this.selectedItem ? this.httpService.post('placement', {
      page_id: this.pageId,
      placements: [{
        _id: this.selectedItem._id,
        info: this.getItemInfo(),
      }],
      is_app: true
    }) : this.httpService.put('placement', {
      page_id: this.pageId,
      placement: {
        component_name: 'feed',
        _id: this.newPlacementId ? this.newPlacementId : null,
        info: this.getItemInfo(true),
      },
      is_app: true,
    })).subscribe(
      (data: any) => {
        this.modifyPlacement.emit({
          type: this.selectedItem ? PlacementModifyEnum.Modify : PlacementModifyEnum.Add,
          placement_id: data.placement_id,
          placements: [this.selectedItem],
          placement: data.new_placement,
        });

        if (this.selectedItem) {
          const newInfo = this.getItemInfo();
          const changedObj = this.placementList.find(el => el._id === this.selectedItem._id);
          changedObj.info.text = newInfo.text;
          changedObj.info.href = newInfo.href;
        } else {
          const newInfo = this.getItemInfo(true);
          this.selectedItem = data.new_placement;
        }

        this.anyChanges = false;
        this.progressService.disable();
      },
      (err) => {
        console.error('Cannot upsert an item of feed placement: ', err);
        this.progressService.disable();
      }
    );
  }

  removeItem() {
    if (!this.selectedItem || !this.selectedItem._id)
      return;

    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });

    this.progressService.enable();
    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.httpService.post('placement/delete', {
            page_id: this.pageId,
            placement_id: this.selectedItem._id,
          }).subscribe(
            (data) => {
              this.modifyPlacement.emit({
                type: PlacementModifyEnum.Delete,
                placement_id: this.selectedItem._id,
              });
              this.setFormValue();
              this.selectedItem = null;
              this.anyChanges = false;
              this.progressService.disable();
            },
            (err) => {
              console.error('Cannot remove an item from feed placement: ', err);
              this.progressService.disable();
            }
          );
        }
      }
    );
  }

  clearFields() {
    this.feedForm.reset();
    this.selectedItem = null;
  }

  getItemInfo(isNewItem = false) {
    const res = {
      text: (this.feedForm.controls['text'].value ? this.feedForm.controls['text'].value : '').trim(),
      href: (this.feedForm.controls['href'].value ? this.feedForm.controls['href'].value : '').trim(),
      imgUrl: this.selectedItem ? this.selectedItem.info.imgUrl : this.imageUrlAddress,
    };

    // Assing new row number
    if (!this.selectedItem)
      res['row'] = Math.max(...this.placementList.map(el => el.info.row)) + 1;

    return res;
  }

  selectItem(item) {
    this.selectedItem = item;
    this.setFormValue(item.info);
  }

  setFormValue(value = null) {
    if (!value)
      this.feedForm.reset();
    else {
      this.feedForm.controls['text'].setValue(value.text);
      this.feedForm.controls['href'].setValue(value.href);
    }
  }

  private fieldChanged() {
    if (!this.selectedItem) {
      this.anyChanges = !!this.imageUrlAddress;
      return;
    }

    this.anyChanges = false;

    ['text', 'href'].forEach(el => {
      if (this.selectedItem.info[el] !== this.feedForm.controls[el].value)
        this.anyChanges = true;
    });
  }

  imageUploadUrl() {
    if (this.selectedItem)
      return `placement/image/${this.pageId}/${this.selectedItem._id}`;

    return `placement/image/${this.pageId}/null`;
  }

  getThisPlacement() {
    return {
      component_name: 'feed',
    };
  }

  imageUploaded(data) {
    if (data) {
      this.snackBar.open('تصویر بارگذاری شد', null, {
        duration: 2300,
      });

      this.imageUrlAddress = this.selectedItem ? data[0] : data[0].downloadURL;
      if (this.selectedItem) {
        this.selectedItem.info.imgUrl = this.imageUrlAddress;
      } else {
        this.newPlacementId = data[0].placementId ? data[0].placementId : null;
      }

      this.anyChanges = true;
    } else
      this.snackBar.open('بارگذاری با خطا رو به رو شد. دوباره تلاش کنید', null, {
        duration: 3200,
      });
  }

  getImageUrl(url) {
    if (url) {
      url = url[0] === '/' ? url : '/' + url;

      return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + url);
    }
  }
}
