import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryTrackingComponent } from './delivery-tracking.component';

describe('DeliveryTrackingComponent', () => {
  let component: DeliveryTrackingComponent;
  let fixture: ComponentFixture<DeliveryTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
