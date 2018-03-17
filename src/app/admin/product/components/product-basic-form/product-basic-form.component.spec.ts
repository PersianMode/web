import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBasicFormComponent } from './product-basic-form.component';

describe('ProductsComponent', () => {
  let component: ProductBasicFormComponent;
  let fixture: ComponentFixture<ProductBasicFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBasicFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBasicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
