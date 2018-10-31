import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertAddressComponent } from './upsert-address.component';

describe('UpsertAddressComponent', () => {
  let component: UpsertAddressComponent;
  let fixture: ComponentFixture<UpsertAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpsertAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
