import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../../../shared/services/http.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ProgressService} from '../../../../shared/services/progress.service';
import {IPageInfo} from 'app/admin/page/interfaces/IPageInfo.interface';
import {ICollection} from '../../interfaces/ICollection.interface';
import {IPlacement} from '../../interfaces/IPlacement.interface';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';
import {PlacementModifyEnum} from '../../enum/placement.modify.type.enum';

@Component({
  selector: 'app-page-basic-form',
  templateUrl: './page-basic-info.component.html',
  styleUrls: ['./page-basic-info.component.css']
})
export class PageBasicInfoComponent implements OnInit {
  placementRows: any[];
  id: string = null;
  originalForm: IPageInfo = null;
  form: FormGroup;
  collection: ICollection = null;

  anyChanges = false;
  upsertBtnShouldDisabled = false;

  placements: IPlacement[] = null;

  @ViewChild('content') contentEl: ElementRef;

  constructor(private route: ActivatedRoute, private progressService: ProgressService,
              private httpService: HttpService, private snackBar: MatSnackBar,
              private dialog: MatDialog, private router: Router) {
  }

  ngOnInit() {
    this.initForm();

    this.route.params.subscribe(
      (params) => {
        this.id = params['id'] && params['id'] !== 'null' ? params['id'] : null;
        this.initPageInfo();

      }
    );

    this.form.valueChanges.subscribe(
      (data) => {
        this.fieldChanged();
      },
      (err) => {
        console.error('->', err);
      }
    );
  }

  initForm() {
    this.form = new FormBuilder().group({
      address: [, [Validators.required]],
      is_app: [false],
      content: []

    }, {});
  }

  initPageInfo() {
    if (!this.id) {
      return;
    }

    this.progressService.enable();
    this.upsertBtnShouldDisabled = true;
    this.httpService.get(`page/${this.id}`).subscribe(
      (data) => {
        data = data[0];
        this.form.controls['address'].setValue(data.address);
        this.form.controls['is_app'].setValue(data.is_app);
        this.form.controls['content'].setValue((data.page_info && data.page_info.content) ? data.page_info.content : null);

        if (data.collection) {
          this.collection = {
            _id: data.collection._id,
            name: data.collection.name
          };
        }
        this.originalForm = data;
        this.progressService.disable();
        this.upsertBtnShouldDisabled = false;

        this.searchPagePlacements();
      },
      (error) => {
        console.error(error);
        this.snackBar.open('Cannot get page details. Please try again', null, {
          duration: 2500,
        });

        this.progressService.disable();
        this.upsertBtnShouldDisabled = false;
      }
    );

  }

  setCollection(collection: any) {
    this.collection = collection;
  }

  submitPage() {

    const data = {
      address: this.form.controls['address'].value,
      is_app: this.form.controls['is_app'].value,
      collection_id: this.collection ? this.collection._id : null,
      content: this.form.controls['content'].value
    };

    this.progressService.enable();
    this.upsertBtnShouldDisabled = true;

    let func;
    if (!this.id)  // add a new page
      func = this.httpService.put(`page`, data);
    else   // update existing page
      func = this.httpService.post(`page/${this.id}`, data);

    func.subscribe(
      (result: any) => {

        this.snackBar.open('page is ' + (this.id ? 'updated' : 'added'), null, {
          duration: 2300,
        });

        this.anyChanges = false;

        this.id = result._id;
        this.searchPagePlacements();

        this.progressService.disable();
        this.upsertBtnShouldDisabled = false;
      },
      (error) => {
        this.snackBar.open(`Cannot ${ !this.id ? 'add' : 'update' } ' this page. Try again`, null, {
          duration: 3200,
        });

        this.progressService.disable();
        this.upsertBtnShouldDisabled = false;
        console.log(error);
      }
    );


  }

  deletePage(id: string = null) {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });
    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.progressService.enable();
          this.httpService.delete(`/page/${id}`).subscribe(
            (data) => {
              this.snackBar.open('Page delete successfully', null, {
                duration: 2000,
              });
              this.progressService.disable();
              this.router.navigate(['/agent/pages']);
            },
            (error) => {
              this.snackBar.open('Cannot delete this page. Please try again', null, {
                duration: 2700
              });
              this.progressService.disable();
            }
          );
        }
      },
      (err) => {
        console.log('Error in dialog: ', err);
      }
    );
  }


  fieldChanged() {
    const previewContent = this.form.controls['content'].value;
    this.contentEl.nativeElement.innerHTML = '';
    if (previewContent)
      this.contentEl.nativeElement.insertAdjacentHTML('beforeend', `${previewContent}`);

    if (!this.originalForm)
      return;

    this.anyChanges = false;

    Object.keys(this.form.controls).forEach(el => {
      let formValue = this.form.controls[el].value;
      let originalValue = this.originalForm[el];

      if (typeof formValue === 'string')
        if (formValue && formValue.trim().length <= 0)
          formValue = null;
        else if (formValue)
          formValue = formValue.trim();

      if (typeof originalValue === 'string')
        if (originalValue && originalValue.trim().length <= 0)
          originalValue = null;
        else if (originalValue)
          originalValue = originalValue.trim();

      if (formValue !== originalValue && (formValue !== '' || originalValue !== null))
        this.anyChanges = true;
    });
  }

  searchPagePlacements() {
    if (!this.id) {
      return;
    }

    this.progressService.enable();
    this.httpService.post(`page/cm/preview`, {address: this.form.controls['address'].value}).subscribe(
      (result) => {

        this.placements = [];

        if (result.placement) {
          result.placement.forEach(p => {
            this.placements.push({
              _id: p._id,
              component_name: p.component_name,
              variable_name: p.variable_name,
              info: p.info,
            });
          });

          this.alignRow();
        }
        this.progressService.disable();
      },
      (error) => {
        console.error(error);
        this.snackBar.open('Cannot get page placements. Please try again', null, {
          duration: 2500,
        });

        this.progressService.disable();
      }
    );

  }

  alignRow() {
    if (this.placements.length <= 0) {
      this.placementRows = [];
      return;
    }
    this.placementRows = [];
    let chunk = [], counter = 0;
    for (const p in this.placements) {
      chunk.push(this.placements[p]);
      counter++;

      if (counter >= 5) {
        counter = 0;
        this.placementRows.push(chunk);
        chunk = [];
      }
    }
    if (counter > 0) {
      this.placementRows.push(chunk);
    }
  }

  modifyPlacement(value) {
    switch (value.type) {
      case PlacementModifyEnum.Delete: {
        const index = this.placements.findIndex(el => el._id.toString() === value.placement_id.toString());
        if (index !== -1)
          this.placements.splice(index, 1);
      }
        break;
      case PlacementModifyEnum.Add: {
        this.placements.push(value.placement);
      }
        break;
      case PlacementModifyEnum.Modify: {
        value.placements.forEach(item => {
          const index = this.placements.findIndex(el => el._id.toString() === item._id.toString());
          if (index !== -1)
            this.placements[index].info = item.info;
        });
      }
        break;
    }
  }

  imageClicked() {
    // function image() {
    //   let fileInput = this.container.querySelector('input.ql-image[type=file]');
    //   if (fileInput == null) {
    //     fileInput = document.createElement('input');
    //     fileInput.setAttribute('type', 'file');
    //     fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
    //     fileInput.classList.add('ql-image');
    //     fileInput.addEventListener('change', () => {
    //       if (fileInput.files != null && fileInput.files[0] != null) {
    //         let reader = new FileReader();
    //         reader.onload = (e) => {
    //           let range = this.quill.getSelection(true);
    //           this.quill.updateContents(new Delta()
    //               .retain(range.index)
    //               .delete(range.length)
    //               .insert({ image: e.target.result })
    //             , Emitter.sources.USER);
    //           this.quill.setSelection(range.index + 1, Emitter.sources.SILENT);
    //           fileInput.value = "";
    //         }
    //         reader.readAsDataURL(fileInput.files[0]);
    //       }
    //     });
    //     this.container.appendChild(fileInput);
    //   }
    //   fileInput.click();
    // }

    console.log('of course this should be executed');
  }
}
