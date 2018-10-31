import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmInboxComponent } from './sm-inbox.component';

describe('SmInboxComponent', () => {
  let component: SmInboxComponent;
  let fixture: ComponentFixture<SmInboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmInboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
