import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopPostedComponent } from './shop-posted.component';

describe('ShopPostedComponent', () => {
  let component: ShopPostedComponent;
  let fixture: ComponentFixture<ShopPostedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopPostedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopPostedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
