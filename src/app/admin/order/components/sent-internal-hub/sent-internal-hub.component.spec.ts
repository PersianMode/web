import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentInternalHubComponent } from './sent-internal-hub.component';

describe('SentInternalHubComponent', () => {
  let component: SentInternalHubComponent;
  let fixture: ComponentFixture<SentInternalHubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentInternalHubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentInternalHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
