import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSendBoxComponent } from './customer-send-box.component';

describe('CustomerSendBoxComponent', () => {
  let component: CustomerSendBoxComponent;
  let fixture: ComponentFixture<CustomerSendBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSendBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSendBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
