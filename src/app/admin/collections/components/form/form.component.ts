import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../../shared/services/http.service";
import {AuthService} from "../../../../shared/services/auth.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  collectionId: string = null;
  collectionForm: FormGroup;
  upsertBtnShouldDisabled: boolean = false;

  constructor(private route: ActivatedRoute, private httpService: HttpService,
              private authService: AuthService) { }

  ngOnInit() {
    this.initForm();

    this.route.params.subscribe(
      (params) => {
        this.collectionId = params['id'] && params['id'] != 'null'? params['id'] : null;
        this.initCollectionInfo();
      }
    )
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
    //this.authService.getOneCollection(collectionId).subscribe(
    this.httpService.getOneCollection(this.collectionId).subscribe(
      (data) => {
        data = data.body;
        this.collectionForm.controls['colName'].setValue(data.name);

        //disable progressive bar
        this.upsertBtnShouldDisabled = false;
      },
      (error) => {
        console.log(error);

        //disable progressive bar
        this.upsertBtnShouldDisabled = false;
      }
    );
  }

  submitCollection() {
    const data = {
      id: this.collectionId,
      name: this.collectionForm.controls['colName'].value,
      //and the name of products
    };

    //enable progressive bar
    this.upsertBtnShouldDisabled = true;
    this.authService.createCollection(data).subscribe(
      (data) => {

        if(!this.collectionId) {
          this.collectionForm.reset();
        }
        else {
          this.collectionId = data.id;
        }

        //disbale progressive bar
        this.upsertBtnShouldDisabled = false;
      },
      (error) => {

        //disable progressive bar
        this.upsertBtnShouldDisabled = false;
      }
    );
  }

  basicInfoValidation(AC: AbstractControl) {

  }
}
