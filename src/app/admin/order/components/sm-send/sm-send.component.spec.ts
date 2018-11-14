import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmSendComponent } from './sm-send.component';

describe('SmSendComponent', () => {
  let component: SmSendComponent;
  let fixture: ComponentFixture<SmSendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmSendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
