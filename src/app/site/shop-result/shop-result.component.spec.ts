import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopResultComponent } from './shop-result.component';

describe('ShopResultComponent', () => {
  let component: ShopResultComponent;
  let fixture: ComponentFixture<ShopResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
