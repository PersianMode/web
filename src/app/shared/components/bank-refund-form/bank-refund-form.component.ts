import {Component, OnInit, EventEmitter, Input, Output, Inject} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-bank-refund-form',
  templateUrl: './bank-refund-form.component.html',
  styleUrls: ['./bank-refund-form.component.css']
})
export class BankRefundFormComponent implements OnInit {

  informationBankForm: FormGroup;

  cardSelected = null;
  formGroup;


  @Input() accessLevel;
  @Input() isNotMobile;
  @Output() closeDialog = new EventEmitter<boolean>();

  constructor(private httpService: HttpService, private snackBar: MatSnackBar) {
    this.createFormGroup();
  }

  ngOnInit() {
    this.informationBankForm = this.formGroup;
  }

  createFormGroup() {
    this.formGroup = new FormGroup({
      owner_card_name: new FormControl(null, Validators.required),
      owner_card_surname: new FormControl(null, Validators.required),
      bank_name: new FormControl(null),
      // card_no: new FormGroup({
      //   first: new FormControl(null, Validators.required),
      //   second: new FormControl(null, Validators.required),
      //   third: new FormControl(null, Validators.required),
      //   fourth: new FormControl(null, Validators.required)
      // }),
      sheba_no: new FormControl(null),
    });
  }

  //
  // onSubmit() {
  //   console.log('informationBankForm', this.informationBankForm.value);
  // }

  submitForm() {
    const sendingData = {
      owner_card_name: this.informationBankForm.controls['owner_card_name'].value,
      owner_card_surname: this.informationBankForm.controls['owner_card_surname'].value,
      bank_name: this.informationBankForm.controls['bank_name'].value,
      // card_no: this.informationBankForm.controls['card_no'].value,
      sheba_no: this.informationBankForm.controls['sheba_no'].value,

    };

    this.httpService.put('refund', sendingData).subscribe(
      (data) => {
        this.closeDialog.emit(false);
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
    this.closeDialog.emit(false);
  }
}
