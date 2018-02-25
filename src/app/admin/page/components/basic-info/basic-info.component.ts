import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../../shared/services/http.service';
import {MatSnackBar} from '@angular/material';
import {ProgressService} from '../../../../shared/services/progress.service';
import {IPageInfo} from 'app/admin/page/interfaces/IPageInfo.interface';
import {ICollection} from '../../interfaces/ICollection.interface';

@Component({
  selector: 'app-form',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {
  id: string = null;
  originalForm: IPageInfo = null;
  form: FormGroup;
  textData: string;
  collection: ICollection = null;
  content: string = null;

  anyChanges = false;
  upsertBtnShouldDisabled = false;

  constructor(private route: ActivatedRoute, private progressService: ProgressService,
              private httpService: HttpService, private snackBar: MatSnackBar) {
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
      address: [null, [
        Validators.required,
      ]],
    }, {});
  }

  initPageInfo() {
    if (!this.id) {
      this.form = null;
      this.initForm();
      return;
    }

    this.progressService.enable();
    this.upsertBtnShouldDisabled = true;
    this.httpService.get(`page/${this.id}`).subscribe(
      (data) => {
        this.form.controls['address'].setValue(data.address);
        this.form.controls['is_app'].setValue(data.is_app);

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

  submitPage() {

    const data = {
      address: this.form.controls['address'].value,
      is_app: this.form.controls['is_app'],
      collection_id: this.collection._id,
      content: this.content
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
        this.form.reset();

        this.progressService.disable();
        this.upsertBtnShouldDisabled = false;
      },
      (error) => {
        this.snackBar.open('Cannot ' + this.id ? 'add' : 'update' + ' this page. Try again', null, {
          duration: 3200,
        });

        this.progressService.disable();
        this.upsertBtnShouldDisabled = false;
        console.log(error);
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


}
