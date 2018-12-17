import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CCDeliveryComponent } from './cc-delivery-box.component';

describe('CCDeliveryComponent', () => {
  let component: CCDeliveryComponent;
  let fixture: ComponentFixture<CCDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CCDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CCDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
