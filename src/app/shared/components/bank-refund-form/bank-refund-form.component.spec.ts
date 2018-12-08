import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankRefundFormComponent } from './bank-refund-form.component';

describe('BankRefundFormComponent', () => {
  let component: BankRefundFormComponent;
  let fixture: ComponentFixture<BankRefundFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankRefundFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankRefundFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
