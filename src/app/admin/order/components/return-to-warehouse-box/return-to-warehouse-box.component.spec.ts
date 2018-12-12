import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnToWarehouseBoxComponent } from './return-to-warehouse-box.component';

describe('ReturnToWarehouseBoxComponent', () => {
  let component: ReturnToWarehouseBoxComponent;
  let fixture: ComponentFixture<ReturnToWarehouseBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnToWarehouseBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnToWarehouseBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
