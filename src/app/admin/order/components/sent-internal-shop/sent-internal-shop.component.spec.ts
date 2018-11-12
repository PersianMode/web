import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentInternalShopComponent } from './sent-internal-shop.component';

describe('SentInternalShopComponent', () => {
  let component: SentInternalShopComponent;
  let fixture: ComponentFixture<SentInternalShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentInternalShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentInternalShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
