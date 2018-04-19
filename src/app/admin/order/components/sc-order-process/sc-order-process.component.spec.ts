import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SCOrderProcessComponent } from './sc-order-process.component';

describe('SMSCOrderProcessComponent', () => {
  let component: SCOrderProcessComponent;
  let fixture: ComponentFixture<SCOrderProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SCOrderProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SCOrderProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
