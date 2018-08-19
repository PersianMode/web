import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmDeliverComponent } from './sm-deliver.component';

describe('SmDeliverComponent', () => {
  let component: SmDeliverComponent;
  let fixture: ComponentFixture<SmDeliverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmDeliverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmDeliverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
