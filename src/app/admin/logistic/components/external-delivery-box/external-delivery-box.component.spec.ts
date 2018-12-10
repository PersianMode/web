import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalDeliveryBoxComponent } from './external-delivery-box.component';

describe('ExternalDeliveryBoxComponent', () => {
  let component: ExternalDeliveryBoxComponent;
  let fixture: ComponentFixture<ExternalDeliveryBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalDeliveryBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalDeliveryBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
