import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../../shared/services/http.service';
import { ProgressService } from '../../../../shared/services/progress.service';

@Component({
  selector: 'app-modify-dictionary',
  templateUrl: './modify-dictionary.component.html',
  styleUrls: ['./modify-dictionary.component.css']
})
export class ModifyDictionaryComponent implements OnInit {

  upsertBtnShouldDisabled = false;
  dictionaryForm: FormGroup;
  types;
  dictionaryId: string;

  constructor(private dialogRef: MatDialogRef<ModifyDictionaryComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any, private httpService: HttpService,
    private progressService: ProgressService) {
}

  ngOnInit() {
    // this.dictionaryForm.controls['type'].setValue(this.data.item.type)
    this.initForm();
    this.types = this.data.types;
    if (this.data.item) {
      this.dictionaryId = this.data.item._id;
    }
  }

  initForm() {
    this.dictionaryForm = new FormBuilder().group({
      name: [null, [
        Validators.required,
      ]],
      value: [null, [
        Validators.required,
      ]],
      type: [ this.data.item ?  this.data.item.type : null, [
        Validators.required,
      ]],
    }, {
      validator: this.basicInfoValidation
    });
  }

  submitDictionary() {
    this.progressService.enable();
    const sendingData = {
      name: this.dictionaryForm.controls['name'].value,
      type: this.dictionaryForm.controls['type'].value,
      value: this.dictionaryForm.controls['value'].value,
    };
    if (this.dictionaryId) {
      this.httpService.post(`/dictionary/${this.dictionaryId}`, sendingData).subscribe((res) => {
        this.progressService.disable();
      });
    }else {
      this.httpService.put(`/dictionary`, sendingData).subscribe((res) => {
        this.progressService.disable();
      });
    }
    this.dialogRef.close({
      status: true
    });
  }

  basicInfoValidation(AC: AbstractControl) {

  }

}
