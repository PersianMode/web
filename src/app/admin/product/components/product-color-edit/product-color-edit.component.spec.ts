import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductColorEditComponent } from './product-color-edit.component';

describe('ProductColorEditComponent', () => {
  let component: ProductColorEditComponent;
  let fixture: ComponentFixture<ProductColorEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductColorEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductColorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
