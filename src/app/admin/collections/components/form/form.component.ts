import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../../shared/services/http.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {isUndefined} from 'util';
import {MatSnackBar} from '@angular/material';
import {ProgressService} from '../../../../shared/services/progress.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  collectionId: string = null;
  originalCollection: any = null;
  collectionForm: FormGroup;

  anyChanges = false;
  upsertBtnShouldDisabled = false;

  constructor(private route: ActivatedRoute, private progressService: ProgressService,
              private httpService: HttpService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.initForm();

    this.route.params.subscribe(
      (params) => {
        this.collectionId = params['id'] && params['id'] !== 'null' ? params['id'] : null;
        this.initCollectionInfo();
      }
    );
    this.collectionForm.valueChanges.subscribe(
      (data) => {
        this.fieldChanged();
      },
      (err) => {
        console.error('ERR', err);
      }
    );
  }

  initForm() {
    this.collectionForm = new FormBuilder().group({
      colName: [null, [
        Validators.required,
      ]],
      is_smart: [null, []],
    }, {
      validator: this.basicInfoValidation
    });
  }

  initCollectionInfo() {
    if (!this.collectionId) {
      this.collectionForm = null;
      this.initForm();
      return;
    }

    this.progressService.enable();
    this.upsertBtnShouldDisabled = true;
    this.httpService.get(`collection/${this.collectionId}`).subscribe(
      (data) => {
        data = data[0];

        this.collectionForm.controls['colName'].setValue(data.name);
        this.collectionForm.controls['is_smart'].setValue(data.is_smart);
        this.originalCollection = {
          _id: data._id,
          name: data.name,
          is_smart: data.is_smart
        };

        this.progressService.disable();
        this.upsertBtnShouldDisabled = false;
      },
      (error) => {
        console.log(error);
        this.snackBar.open('Cannot get collection details. Please try again', null, {
          duration: 2500,
        });

        this.progressService.disable();
        this.upsertBtnShouldDisabled = false;
      }
    );
  }

  submitCollection() {
    const sendingData = {
      _id: this.collectionId,
      name: this.collectionForm.controls['colName'].value,
      is_smart: this.collectionForm.controls['is_smart'].value,
    };
    // if(this.collectionId)
    //   data['_id'] = this.collectionId;

    this.progressService.enable();
    this.upsertBtnShouldDisabled = true;
    this.httpService.put(`collection`, sendingData).subscribe(
      data => {
        let isCreating = false;
        if (data._id) {
          isCreating = true;
        }
        this.snackBar.open('Collection is ' + (this.collectionId ? 'updated' : 'added'), null, {
          duration: 2300,
        });

        this.anyChanges = false;
        if (isCreating) {
          this.collectionId = data._id;
          this.originalCollection = Object.assign({_id: data._id}, data);
          this.collectionForm.reset();
        }
        // else {
        // this.collectionId = data._id;
        // this.originalCollection = Object.assign({_id: data._id}, data);
        // this.originalCollection.name = this.collectionForm.controls['colName'].value;
        // }

        this.progressService.disable();
        this.upsertBtnShouldDisabled = false;
      },
      error => {
        this.snackBar.open('Cannot ' + (this.collectionId ? 'update' : 'add') + ' this collection. Try again', null, {
          duration: 3200,
        });

        this.progressService.disable();
        this.upsertBtnShouldDisabled = false;
        // console.log(error);
      }
    );
  }

  fieldChanged() {
    if (!this.originalCollection) {
      return;
    }
    this.anyChanges = false;
    let colName = (this.collectionForm.controls['colName'].value === null ||
      isUndefined(this.collectionForm.controls['colName'].value)) ? '' : this.collectionForm.controls['colName'].value;
    colName = colName.trim();

    let orig_colName = this.originalCollection.name;
    orig_colName = orig_colName.trim();

    const is_smart = (this.collectionForm.controls['is_smart'].value === null ||
      isUndefined(this.collectionForm.controls['is_smart'].value)) ? '' : this.collectionForm.controls['is_smart'].value;
    const orig_is_smart = this.originalCollection.is_smart;

    if ((colName !== orig_colName && (colName !== '' || orig_colName !== null)) ||
      ((is_smart !== orig_is_smart && (is_smart !== '' || orig_is_smart !== null)))) {
      this.anyChanges = true;
    }
  }

  basicInfoValidation(AC: AbstractControl) {

  }
}
