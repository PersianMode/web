import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInstanceComponent } from './product-instance.component';

describe('ProductInstanceComponent', () => {
  let component: ProductInstanceComponent;
  let fixture: ComponentFixture<ProductInstanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductInstanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
