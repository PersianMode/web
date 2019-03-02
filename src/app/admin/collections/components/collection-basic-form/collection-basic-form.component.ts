import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../shared/services/http.service';
import { isUndefined } from 'util';
import { MatSnackBar } from '@angular/material';
import { ProgressService } from '../../../../shared/services/progress.service';

@Component({
  selector: 'app-collection-basic-form',
  templateUrl: './collection-basic-form.component.html',
  styleUrls: ['./collection-basic-form.component.css']
})
export class CollectionBasicFormComponent implements OnInit {
  @Input() collectionId: string;
  @Output() onCollectionIdChanged = new EventEmitter<string>();
  originalCollection: any = null;
  collectionForm: FormGroup;
  id: string = null;
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
        this.id = params['id'] && params['id'] !== 'null' ? params['id'] : null;
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
      name: [null, [
        Validators.required,
      ]],
      name_fa: [null, [
        Validators.required,
      ]],
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
        this.collectionForm.controls['name'].setValue(data.name);
        this.collectionForm.controls['name_fa'].setValue(data.name_fa);
        this.originalCollection = {
          _id: data._id,
          name: data.name,
          name_fa: data.name_fa
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
      name: this.collectionForm.controls['name'].value,
      name_fa: this.collectionForm.controls['name_fa'].value,
    };
    // if(this.collectionId)
    //   data['_id'] = this.collectionId;

    this.progressService.enable();
    this.upsertBtnShouldDisabled = true;

    const exec = this.collectionId ?
      this.httpService.post(`collection/${this.collectionId}`, sendingData) :
      this.httpService.put('collection', sendingData);

    exec.subscribe(
      data => {
        this.snackBar.open('Collection is ' + (this.collectionId ? 'updated' : 'added'), null, {
          duration: 2300,
        });

        this.anyChanges = false;
        this.collectionId = data._id;
        this.originalCollection = Object.assign({ _id: data._id }, data);
        this.progressService.disable();
        this.upsertBtnShouldDisabled = false;

        this.onCollectionIdChanged.emit(this.collectionId);
        this.submitpage();
        this.progressService.disable();
      },
      error => {
        this.snackBar.open('Cannot ' + (this.collectionId ? 'update' : 'add') + ' this collection. Try again', null, {
          duration: 3200,
        });

        this.progressService.disable();
        this.upsertBtnShouldDisabled = false;
      }
    );
  }

  fieldChanged() {
    if (!this.originalCollection) {
      return;
    }
    this.anyChanges = false;
    let name = (this.collectionForm.controls['name'].value === null ||
      isUndefined(this.collectionForm.controls['name'].value)) ? '' : this.collectionForm.controls['name'].value;
    name = name.trim();

    let name_fa = (this.collectionForm.controls['name_fa'].value === null ||
      isUndefined(this.collectionForm.controls['name_fa'].value)) ? '' : this.collectionForm.controls['name_fa'].value;
    name_fa = name_fa.trim();

    let orig_name = this.originalCollection.name;
    orig_name = orig_name.trim();

    let orig_name_fa = this.originalCollection.name_fa;
    orig_name_fa = orig_name.trim();

    if ((name !== orig_name && (name !== '' || orig_name !== null)) ||
      (name_fa !== orig_name_fa && (name_fa !== '' || orig_name_fa !== null))) {
      this.anyChanges = true;
    }
  }

  basicInfoValidation(AC: AbstractControl) {

  }
  submitpage() {
    const data = {
      address: 'collection/' + this.collectionForm.controls['name'].value,
      title: this.collectionForm.controls['name_fa'].value,
      is_app: false,
      collection_id: this.id ? this.id : this.collectionId,
      content: null,
    };

    this.progressService.enable();
    let func;
    // add a new page
    func = this.httpService.put(`page`, data);
    func.subscribe(
      (result: any) => {
        this.snackBar.open('page is ' + (this.id ? 'updated' : 'added'), null, {
          duration: 2300,
        });
        this.progressService.disable();
      }, (error: any) => {
        console.log(error);
      }
     );
  }
}
