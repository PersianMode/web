import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopBalanceResultComponent } from './shop-balance-result.component';

describe('ShopBalanceResultComponent', () => {
  let component: ShopBalanceResultComponent;
  let fixture: ComponentFixture<ShopBalanceResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopBalanceResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopBalanceResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
