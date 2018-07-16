import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutWarningConfirmComponent } from './checkout-warning-confirm.component';

describe('CheckoutWarningConfirmComponent', () => {
  let component: CheckoutWarningConfirmComponent;
  let fixture: ComponentFixture<CheckoutWarningConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutWarningConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutWarningConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
