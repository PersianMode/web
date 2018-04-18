import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SMOrderProcessComponent } from './sm-order-process.component';

describe('SMSMOrderProcessComponent', () => {
  let component: SMOrderProcessComponent;
  let fixture: ComponentFixture<SMOrderProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SMOrderProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SMOrderProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
