import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SCInboxComponent } from './sc-inbox.component';

describe('SCInboxComponent', () => {
  let component: SCInboxComponent;
  let fixture: ComponentFixture<SCInboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SCInboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SCInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
