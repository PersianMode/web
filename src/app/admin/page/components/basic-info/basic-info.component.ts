import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../../../shared/services/http.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ProgressService} from '../../../../shared/services/progress.service';
import {IPageInfo} from 'app/admin/page/interfaces/IPageInfo.interface';
import {ICollection} from '../../interfaces/ICollection.interface';
import {IPlacement} from '../../interfaces/IPlacement.interface';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';

@Component({
  selector: 'app-form',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {
  id: string = null;
  originalForm: IPageInfo = null;
  form: FormGroup;
  collection: ICollection = null;

  anyChanges = false;
  upsertBtnShouldDisabled = false;

  placements: IPlacement[] = null;

  constructor(private route: ActivatedRoute, private progressService: ProgressService,
              private httpService: HttpService, private snackBar: MatSnackBar, private dialog: MatDialog, private router: Router) {
  }

  ngOnInit() {
    this.initForm();

    this.route.params.subscribe(
      (params) => {
        this.id = params['id'] && params['id'] !== 'null' ? params['id'] : null;
        this.initPageInfo();
        this.searchPagePlacements();
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
        this.form.controls['content'].setValue(data.page_info.content);

        this.collection = {
          _id: data.collection._id,
          name: data.collection.name
        };
        this.originalForm = data;
        this.progressService.disable();
        this.upsertBtnShouldDisabled = false;
      },
      (error) => {
        console.log(error);
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
    this.httpService.get(`page/placement/list`).subscribe(
      (result) => {

        this.placements = [];
        result.data.forEach(d => {
          this.placements.push({
            _id: d._id,
            component_name: d.placement.component_name
          });
        });


        this.progressService.disable();
      },
      (error) => {
        console.log(error);
        this.snackBar.open('Cannot get page placements. Please try again', null, {
          duration: 2500,
        });

        this.progressService.disable();
      }
    );

  }

  addPlacement() {

  }

  editPlacement(_id: String) {

  }

  deletePlacement(_id: String) {

  }


}
