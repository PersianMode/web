import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubShelfOrderComponent } from './hub-shelf-order.component';

describe('HubShelfOrderComponent', () => {
  let component: HubShelfOrderComponent;
  let fixture: ComponentFixture<HubShelfOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubShelfOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubShelfOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
