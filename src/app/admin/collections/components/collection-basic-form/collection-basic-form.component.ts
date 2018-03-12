import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../../shared/services/http.service';
import {isUndefined} from 'util';
import {MatSnackBar} from '@angular/material';
import {ProgressService} from '../../../../shared/services/progress.service';

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
        this.collectionForm.controls['colName'].setValue(data.name);
        this.originalCollection = {
          _id: data._id,
          name: data.name,
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
      name: this.collectionForm.controls['colName'].value,
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
        this.originalCollection = Object.assign({_id: data._id}, data);
        this.progressService.disable();
        this.upsertBtnShouldDisabled = false;

        this.collectionId = data._id;
        this.onCollectionIdChanged.emit(this.collectionId);


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
    let colName = (this.collectionForm.controls['colName'].value === null ||
      isUndefined(this.collectionForm.controls['colName'].value)) ? '' : this.collectionForm.controls['colName'].value;
    colName = colName.trim();

    let orig_colName = this.originalCollection.name;
    orig_colName = orig_colName.trim();

    if ((colName !== orig_colName && (colName !== '' || orig_colName !== null))) {
      this.anyChanges = true;
    }
  }

  basicInfoValidation(AC: AbstractControl) {

  }
}
