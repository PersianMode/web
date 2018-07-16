import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryShelfCodeComponent } from './delivery-shelf-code.component';

describe('DeliveryShelfCodeComponent', () => {
  let component: DeliveryShelfCodeComponent;
  let fixture: ComponentFixture<DeliveryShelfCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryShelfCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryShelfCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
