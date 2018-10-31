import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProgressService} from '../../../../shared/services/progress.service';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';

@Component({
  selector: 'app-loyalty-discount',
  templateUrl: './loyalty-discount.component.html',
  styleUrls: ['./loyalty-discount.component.css']
})
export class LoyaltyDiscountComponent implements OnInit {
  anyChanges = false;
  selectedGroup = null;
  discountForm: FormGroup = null;
  upsertBtnShouldDisabled = true;

  @Input() selectedDuration;
  @Input() loyaltyLabel;

  @Input()
  set saveDiscountNotification(value) {
    if (value === null) {
      return;
    }
    if (value) {
      this.submitTotalInfo();
    } else {
      this.progressService.enable();
      this.httpService.get(`deliveryduration/${this.selectedDuration._id}`).subscribe(data => {
        data.delivery_loyalty.forEach(el => {
          const del_loyalty = this.selectedDuration.delivery_loyalty.find(i => i._id === el._id);
          del_loyalty.discount = el.discount;
        });
        console.log('selectedDuration : ', this.selectedDuration);
        this.progressService.disable();
        this.snackBar.open('ثبت تغییرات به درخواست شما لغو گردید', null, {
          duration: 3200,
        });
      }, err => {
        this.progressService.disable();
        console.error('Cannot get loyalty groups: ', err);
        this.snackBar.open('سیستم قادر به دریافت اطلاعات نیست. دوباره تلاش کنید', null, {
          duration: 3200,
        });
      });
    }
    ;
    this.upsertBtnShouldDisabled = true;
  }

  @Output() leaveWithoutSubmitChanges = new EventEmitter();

  constructor(private httpService: HttpService, private progressService: ProgressService,
              private snackBar: MatSnackBar, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.initForm();
    this.discountForm.valueChanges.subscribe(() => this.fieldChanged());
  }

  initForm() {
    this.discountForm = new FormBuilder().group({
      name: [null, [
        Validators.required,
      ]],
      discount_percent: [null, [
        Validators.required,
      ]]
    });
  }

  upsertDiscount() {
    this.upsertBtnShouldDisabled = true;
    if (!this.anyChanges)
      return;
    this.selectedGroup.discount = this.discountForm.controls['discount_percent'].value;
    if (!this.selectedDuration.delivery_loyalty.filter(el => !el.discount).length)
      this.upsertBtnShouldDisabled = false;
    this.discountForm.reset();

    this.leaveWithoutSubmitChanges.emit(this.upsertBtnShouldDisabled);  // emit the value(maybe true maybe false) to notify save changes dialog (if need) while change tabs
  }

  fieldChanged() {
    this.anyChanges = false;
    const formName = this.discountForm.controls['name'].value;
    const objName = this.selectedGroup.name;
    const formDiscount = this.discountForm.controls['discount_percent'].value;
    const objDiscount = this.selectedGroup.discount;
    if (this.selectedGroup) {
      if (formDiscount !== objDiscount && (formDiscount !== '' || objDiscount !== null)
        || (formName !== objName && (formName !== '' || objName !== null)))
        this.anyChanges = true;
    }
  }

  submitTotalInfo() {
    if (this.selectedDuration.is_c_and_c === true)
      return;
    this.progressService.enable();
    this.httpService.post('deliveryduration', this.selectedDuration).subscribe(
      res => {
        this.snackBar.open('تغییرات با موفقیت ثبت شدند', null, {
          duration: 2300,
        });
        this.progressService.disable();
        this.discountForm.reset();
        this.upsertBtnShouldDisabled = true;
        this.leaveWithoutSubmitChanges.emit(this.upsertBtnShouldDisabled);  // always emit true, so means no need to show save change dialog window while changing tabs
      },
      err => {
        console.error('Cannot upsert delivery duration info: ', err);
        this.snackBar.open('سیستم قادر به اعمال تغییرات شما نیست. دوباره تلاش کنید', null, {
          duration: 3200,
        });
        this.progressService.disable();
      });
  };

  editDiscount(item) {
    this.selectedGroup = item;
    this.discountForm.controls['name'].setValue(item.name);
    this.discountForm.controls['discount_percent'].setValue(item.discount ? item.discount : null);
  }

  clearFields() {
    this.selectedGroup = null;
    this.discountForm.reset();
  }

  formatter(number) {
    return priceFormatter(number);
  }
}
