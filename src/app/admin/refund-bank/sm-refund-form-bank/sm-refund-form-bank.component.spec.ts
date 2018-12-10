import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmRefundFormBankComponent } from './sm-refund-form-bank.component';

describe('SmRefundFormBankComponent', () => {
  let component: SmRefundFormBankComponent;
  let fixture: ComponentFixture<SmRefundFormBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmRefundFormBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmRefundFormBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
