import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeCheckerComponent } from './barcode-checker.component';

describe('BarcodeCheckerComponent', () => {
  let component: BarcodeCheckerComponent;
  let fixture: ComponentFixture<BarcodeCheckerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcodeCheckerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
