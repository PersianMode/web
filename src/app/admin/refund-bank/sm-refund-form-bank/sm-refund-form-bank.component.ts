import {Component, OnInit, EventEmitter, Input, Output, Inject} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../shared/services/http.service';

@Component({
  selector: 'app-sm-refund-form-bank',
  templateUrl: './sm-refund-form-bank.component.html',
  styleUrls: ['./sm-refund-form-bank.component.css']
})
export class SmRefundFormBankComponent implements OnInit {

  informationBankForm: FormGroup;
  formGroup;
  @Input() accessLevel;
  @Input() isNotMobile;
  @Output() closeDialog = new EventEmitter<boolean>();

  constructor(private httpService: HttpService, private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<SmRefundFormBankComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.createFormGroup(
      this.data.owner_card_name,
      this.data.owner_card_surname,
      this.data.customer_first_name,
      this.data.customer_surname,
      this.data.bank_name,
      this.data.amount,
      this.data.mobile_number,
      this.data.card_no,
      this.data.sheba_no,
      this.data.comment
    );
  }

  ngOnInit() {
    this.informationBankForm = this.formGroup;
  }

  createFormGroup(owner_card_name = null, owner_card_surname = null, customer_first_name = null, customer_surname = null,
                  bank_name = null, amount = null,  mobile_number = null, card_no = null, sheba_no = null, comment = null) {
    this.formGroup = new FormGroup({
      owner_card_name: new FormControl({value: owner_card_name, disabled: true}, Validators.required),
      owner_card_surname: new FormControl({value: owner_card_surname, disabled: true}, Validators.required),
      customer_first_name: new FormControl({value: customer_first_name, disabled: true}, Validators.required),
      customer_surname: new FormControl({value: customer_surname, disabled: true}, Validators.required),
      bank_name: new FormControl({value: bank_name, disabled: true}, Validators.required),
      amount: new FormControl({value: amount, disabled: true}, Validators.required),
      mobile_number: new FormControl({value: mobile_number, disabled: true}, Validators.required),
      card_no: new FormControl({value: card_no, disabled: true}, Validators.required),
      sheba_no: new FormControl({value: sheba_no, disabled: true}, Validators.required),
      comment: new FormControl(comment),
    });
  }

  onSubmit() {
  }

  submitForm() {
    this.dialogRef.close(true);
    const sendingData = {
      _id: this.data._id,
      owner_card_name: this.informationBankForm.controls['owner_card_name'].value,
      owner_card_surname: this.informationBankForm.controls['owner_card_surname'].value,
      bank_name: this.informationBankForm.controls['bank_name'].value,
      card_no: this.informationBankForm.controls['card_no'].value,
      sheba_no: this.informationBankForm.controls['sheba_no'].value,
      status: 2,
      comment: this.informationBankForm.controls['comment'].value,
      executed_time: new Date(),
      amount: this.data.amount
    };

    this.httpService.post('refund/set_detail_form', sendingData).subscribe(
      (data) => {
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

  cancelForm() {
    this.dialogRef.close(true);
    const sendingData = {
      _id: this.data._id,
      status: 3,
      comment: this.informationBankForm.controls['comment'].value,
      executed_time: new Date(),
      customer_id: this.data.customer_id,
      amount: this.informationBankForm.controls['amount'].value
    };

    this.httpService.post('refund/reject_detail_form', sendingData).subscribe(
      (data) => {
        this.snackBar.open(`درخواست بازگشت وجه لغو شد`, null, {
          duration: 2300,
        });
      },
      (err) => {
        console.error(err);
        this.snackBar.open(`لغو درخواست بازگشت وجه با مشکل مواجه شد، لطفا دوباره تلاش کنید`, null, {
          duration: 3200,
        });
      }
    );
  }

  onClose() {
    this.dialogRef.close();
  }

  checkValidation() {
    return !(this.data.status === 2 || this.data.status === 3);
  }
}
