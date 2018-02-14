import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../../shared/services/http.service";
import {AuthService} from "../../../../shared/services/auth.service";
import {isUndefined} from "util";
import {MatSnackBar} from "@angular/material";

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
  upsertBtnShouldDisabled: boolean = false;

  constructor(private route: ActivatedRoute, private httpService: HttpService,
              private authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.initForm();

    this.route.params.subscribe(
      (params) => {
        this.collectionId = params['id'] && params['id'] != 'null'? params['id'] : null;
        this.initCollectionInfo();
      }
    )
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
    })
  }

  initCollectionInfo() {
    if(!this.collectionId) {
      this.collectionForm = null;
      this.initForm();
      return;
    }

    //enable progressive bar
    this.upsertBtnShouldDisabled = true;
    this.authService.getOneCollection(this.collectionId).subscribe(
    // this.httpService.getOneCollection(this.collectionId).subscribe(
      (data) => {
        data = data.body[0];
        data['_id'] = data['collection']['_id'];
        data['name'] = data['collection']['name'];
        data['image_url'] = data['collection']['image_url'];

        this.collectionForm.controls['colName'].setValue(data.name);
        this.originalCollection = data;

        //disable progressive bar
        this.upsertBtnShouldDisabled = false;
      },
      (error) => {
        console.log(error);
        this.snackBar.open('Cannot get expertise details. Please try again', null, {
          duration: 2500,
        });

        //disable progressive bar
        this.upsertBtnShouldDisabled = false;
      }
    );
  }

  submitCollection() {
    const data = {
      _id: this.collectionId,
      name: this.collectionForm.controls['colName'].value,
      //and the name of products
    };
    // if(this.collectionId)
    //   data['_id'] = this.collectionId;

    //enable progressive bar
    this.upsertBtnShouldDisabled = true;
    this.authService.createCollection(data).subscribe(
      (data) => {
        if(data.body)
          data = data.body;

        let isCreating = false;
        if(data._id)
          isCreating = true;

        // console.log(data);

        this.snackBar.open('Collection is ' + (this.collectionId ? 'updated' : 'added'), null, {
          duration: 2300,
        });

        this.anyChanges = false;
        if(isCreating) {
          this.collectionId = data._id;
          this.originalCollection = Object.assign({_id: data._id}, data);
          this.collectionForm.reset();
        }
        // else {
          // this.collectionId = data._id;
          // this.originalCollection = Object.assign({_id: data._id}, data);
          // this.originalCollection.name = this.collectionForm.controls['colName'].value;
        // }

        //disable progressive bar
        this.upsertBtnShouldDisabled = false;
      },
      (error) => {
        this.snackBar.open('Cannot ' + this.collectionId ? 'add' : 'update' + ' this collection. Try again', null, {
          duration: 3200,
        });

        //disable progressive bar
        this.upsertBtnShouldDisabled = false;
        console.log(error);
      }
    );
  }

  fieldChanged() {
    if(!this.originalCollection)
      return;

    this.anyChanges = false;

    let colName = (this.collectionForm.controls['colName'].value === null || isUndefined(this.collectionForm.controls['colName'].value)) ? '' : this.collectionForm.controls['colName'].value;
    colName = colName.trim();

    let orig_colName = this.originalCollection.name;
    orig_colName = orig_colName.trim();

    if(colName !== orig_colName && (colName !== '' || orig_colName !== null))
      this.anyChanges = true;
  }

  basicInfoValidation(AC: AbstractControl) {

  }
}
