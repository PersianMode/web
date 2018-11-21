import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundBankComponent } from './refund-bank.component';

describe('RefundBankComponent', () => {
  let component: RefundBankComponent;
  let fixture: ComponentFixture<RefundBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
