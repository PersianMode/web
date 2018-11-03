import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubInboxComponent } from './hub-inbox.component';

describe('HubInboxComponent', () => {
  let component: HubInboxComponent;
  let fixture: ComponentFixture<HubInboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubInboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
