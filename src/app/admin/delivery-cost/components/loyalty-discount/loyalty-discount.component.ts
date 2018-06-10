import {Component, OnInit, Input} from '@angular/core';
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
  loyalty_label;
  loyaltyList;
  anyChanges = false;
  selectedGroup = null;
  loyaltyDiscountList = [];
  discountForm: FormGroup = null;
  upsertBtnShouldDisabled = true;

  @Input() selectedDuration;

  @Input()
  set loyaltyLabel(value) {
    this.loyalty_label = value;
    if (this.loyaltyList && this.loyaltyList.length)
      this.loyaltyList.forEach(el => el.value = null);
  }

  constructor(private httpService: HttpService, private progressService: ProgressService,
              private snackBar: MatSnackBar, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.initForm();
    this.discountForm.valueChanges.subscribe(() => this.fieldChanged());
    this.getGroups();
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

  getGroups() {
    this.httpService.get('loyaltygroup').subscribe(
      data => {
        this.loyaltyList = data;
      },
      err => {
        console.error('Cannot get loyalty groups: ', err);
        this.snackBar.open('سیستم قادر به دریافت اطلاعات گروه های وفاداری نیست. دوباره تلاش کنید', null, {
          duration: 3200,
        });
      }
    );
  }


  upsertDiscount() {
    this.upsertBtnShouldDisabled = true;
    if (!this.anyChanges)
      return;
    this.selectedGroup.discount = this.discountForm.controls['discount_percent'].value;
    if (!this.selectedDuration.delivery_loyalty.filter(el => !el.discount).length)
      this.upsertBtnShouldDisabled = false;
    this.discountForm.reset();
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

  submitDiscount() {
    this.loyaltyDiscountList = [];
    this.loyaltyList.forEach(el => {
      if (!this.loyaltyDiscountList.map(i => i.name).includes(el))
        this.loyaltyDiscountList.push(el);
    });
  }

  submitTotalInfo() {
    this.progressService.enable();
     this.httpService.post('deliveryduration', this.selectedDuration).subscribe(
       res => {
         this.snackBar.open('تغییرات با موفقیت ثبت شدند', null, {
           duration: 2300,
         });
         this.progressService.disable();
           this.discountForm.reset();
           this.upsertBtnShouldDisabled = true;
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
