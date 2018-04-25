import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../../shared/services/http.service';
import { ProgressService } from '../../../../shared/services/progress.service';

@Component({
  selector: 'app-add-dictionary',
  templateUrl: './add-dictionary.component.html',
  styleUrls: ['./add-dictionary.component.css']
})
export class AddDictionaryComponent implements OnInit {

  upsertBtnShouldDisabled = false;
  dictionaryForm: FormGroup;
  types;
  dictionaryId: string;

  constructor(private dialogRef: MatDialogRef<AddDictionaryComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any, private httpService: HttpService,
    private progressService: ProgressService) {
}

  ngOnInit() {
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
      type: [null, [
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
    this.dialogRef.close();
  }

  basicInfoValidation(AC: AbstractControl) {

  }

}
