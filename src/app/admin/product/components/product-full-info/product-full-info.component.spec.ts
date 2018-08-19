import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFullInfoComponent } from './product-full-info.component';

describe('ProductFullInfoComponent', () => {
  let component: ProductFullInfoComponent;
  let fixture: ComponentFixture<ProductFullInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductFullInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFullInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
