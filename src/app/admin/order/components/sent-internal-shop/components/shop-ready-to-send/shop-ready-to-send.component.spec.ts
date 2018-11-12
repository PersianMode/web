import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopReadyToSendComponent } from './shop-ready-to-send.component';

describe('ShopReadyToSendComponent', () => {
  let component: ShopReadyToSendComponent;
  let fixture: ComponentFixture<ShopReadyToSendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopReadyToSendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopReadyToSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
