import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyToSendComponent } from './ready-to-send.component';

describe('ReadyToSendComponent', () => {
  let component: ReadyToSendComponent;
  let fixture: ComponentFixture<ReadyToSendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadyToSendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadyToSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
