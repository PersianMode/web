import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryCostComponent } from './delivery-cost.component';

describe('DeliveryCostComponent', () => {
  let component: DeliveryCostComponent;
  let fixture: ComponentFixture<DeliveryCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
