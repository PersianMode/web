import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfCodePrinterComponent } from './shelf-code-printer.component';

describe('ShelfCodePrinterComponent', () => {
  let component: ShelfCodePrinterComponent;
  let fixture: ComponentFixture<ShelfCodePrinterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShelfCodePrinterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelfCodePrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
