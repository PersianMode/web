import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../../shared/services/http.service';

@Component({
  selector: 'app-add-dictionary',
  templateUrl: './add-dictionary.component.html',
  styleUrls: ['./add-dictionary.component.css']
})
export class AddDictionaryComponent implements OnInit {

  upsertBtnShouldDisabled = false;
  dictionaryForm: FormGroup;
  types;
  constructor(private dialogRef: MatDialogRef<AddDictionaryComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any, private httpService: HttpService) {
}

  ngOnInit() {
    this.initForm();
    this.types = this.data.types;
  }

  initForm() {
    this.dictionaryForm = new FormBuilder().group({
      name: [null, [
        Validators.required,
      ]],
      value: [null, [
        Validators.required,
      ]],
      type: [null, [
        Validators.required,
      ]],
    }, {
      validator: this.basicInfoValidation
    });
  }

  submitDictionary() {
    const sendingData = {
      name: this.dictionaryForm.controls['name'].value,
      type: this.dictionaryForm.controls['type'].value,
      value: this.dictionaryForm.controls['value'].value,
    };
    this.httpService.put(`/dictionary`, sendingData).subscribe((res) => {
      console.log('subscribe--->', res);
    });
    this.dialogRef.close();
  }

  basicInfoValidation(AC: AbstractControl) {

  }

}
