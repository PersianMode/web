import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentCustomerComponent } from './sent-customer.component';

describe('SentCustomerComponent', () => {
  let component: SentCustomerComponent;
  let fixture: ComponentFixture<SentCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
