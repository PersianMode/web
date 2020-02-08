import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopEasyPayResultComponent } from './shop-easy-pay-result.component';

describe('ShopEasyPayResultComponent', () => {
  let component: ShopEasyPayResultComponent;
  let fixture: ComponentFixture<ShopEasyPayResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopEasyPayResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopEasyPayResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
