import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalDeliveryBoxComponent } from './internal-delivery-box.component';

describe('InternalDeliveryBoxComponent', () => {
  let component: InternalDeliveryBoxComponent;
  let fixture: ComponentFixture<InternalDeliveryBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalDeliveryBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalDeliveryBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
