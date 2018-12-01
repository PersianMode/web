import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverypriorityComponent } from './deliverypriority.component';

describe('DeliverypriorityComponent', () => {
  let component: DeliverypriorityComponent;
  let fixture: ComponentFixture<DeliverypriorityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliverypriorityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverypriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
