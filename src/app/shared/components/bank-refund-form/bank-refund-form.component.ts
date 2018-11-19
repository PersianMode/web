import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-bank-refund-form',
  templateUrl: './bank-refund-form.component.html',
  styleUrls: ['./bank-refund-form.component.css']
})
export class BankRefundFormComponent implements OnInit {

  informationBankForm: FormGroup;

  // cardTypes = [{id: 1, value: 'شماره کارت'}, {id: 2, value: 'شماره شبا'}];
  cardSelected = null;
  formGroup;


  @Input() accessLevel;
  @Input() isNotMobile;
  @Output() closeDialog = new EventEmitter<boolean>();

  constructor() {
    this.createFormGroup();
  }

  ngOnInit() {
    this.informationBankForm = this.formGroup;
  }

  createFormGroup() {
    this.formGroup = new FormGroup({
      firstname: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
      bankName: new FormControl(null, Validators.required),
      cardBank: new FormGroup({
        first: new FormControl(null, Validators.required),
        second: new FormControl(null, Validators.required),
        third: new FormControl(null, Validators.required),
        fourth: new FormControl(null, Validators.required)
      }),
      cardShaba: new FormControl(null),
      comment: new FormControl(null),
    });
  }

  onSubmit() {
    console.log('informationBankForm', this.informationBankForm.value);
  }

  cancelForm() {
    this.closeDialog.emit(false);
  }
}
