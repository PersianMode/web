import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalDeliveryComponent } from './internal-delivery.component';

describe('InternalDeliveryComponent', () => {
  let component: InternalDeliveryComponent;
  let fixture: ComponentFixture<InternalDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
