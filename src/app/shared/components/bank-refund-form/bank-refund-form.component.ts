import {Component, OnInit, EventEmitter, Input, Output, Inject} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {MatSnackBar} from '@angular/material';
import {CardTypes} from '../../enum/cardTypes.enum';

@Component({
  selector: 'app-bank-refund-form',
  templateUrl: './bank-refund-form.component.html',
  styleUrls: ['./bank-refund-form.component.css']
})
export class BankRefundFormComponent implements OnInit {

  informationBankForm: FormGroup;
  cardTypes = CardTypes;
  cardSelected = null;
  formGroup;
  balance;
  card_no;
  sheba_no;
  @Input() isNotMobile;
  @Output() closeDialog = new EventEmitter<any>();

  constructor(private httpService: HttpService, private snackBar: MatSnackBar) {
    this.createFormGroup();
  }

  ngOnInit() {
    this.checkBalance();
    this.informationBankForm = this.formGroup;
  }

  createFormGroup() {
    this.formGroup = new FormGroup({
      owner_card_name: new FormControl(null, Validators.required),
      owner_card_surname: new FormControl(null, Validators.required),
      bank_name: new FormControl(null),
      card_no: new FormControl(null, [
        Validators.maxLength(16),
        Validators.minLength(16),
        Validators.pattern(/^[\u0660-\u06690-9\u06F0-\u06F9]+$/)]),
      sheba_no: new FormControl(null, [
        Validators.maxLength(24),
        Validators.minLength(24),
        Validators.pattern(/^[\u0660-\u06690-9\u06F0-\u06F9]+$/)]),
    });
  }

  submitForm() {

    const sendingData = {
      owner_card_name: this.informationBankForm.controls['owner_card_name'].value,
      owner_card_surname: this.informationBankForm.controls['owner_card_surname'].value,
      bank_name: this.informationBankForm.controls['bank_name'].value,
      card_no: this.informationBankForm.controls['card_no'].value ? this.informationBankForm.controls['card_no'].value : '-',
      sheba_no: this.informationBankForm.controls['sheba_no'].value ? this.informationBankForm.controls['sheba_no'].value : '-'
    };

    this.httpService.put('refund', sendingData).subscribe(
      (data) => {
        this.closeDialog.emit(true);
        this.snackBar.open(`اطلاعات با موفقیت ثبت گردید`, null, {
          duration: 2300,
        });
      },
      (err) => {
        console.error();
        this.snackBar.open(`ثبت اطلاعات با مشکل مواجه شد، لطفا دوباره تلاش کنید`, null, {
          duration: 3200,
        });
      }
    );
  }

  checkValidation() {
    return !(this.informationBankForm.valid &&
      (this.informationBankForm.controls['sheba_no'].value || this.informationBankForm.controls['card_no'].value)
    );
  }

  checkBalance() {
    this.httpService.get(`refund/get_balance`).subscribe(res => {
      this.balance = res[0].balance;
    });
  }

  cancelForm() {
    this.closeDialog.emit(false);
  }
}
