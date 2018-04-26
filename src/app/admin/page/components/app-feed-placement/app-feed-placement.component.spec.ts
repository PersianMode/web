import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFeedPlacementComponent } from './app-feed-placement.component';

describe('AppFeedPlacementComponent', () => {
  let component: AppFeedPlacementComponent;
  let fixture: ComponentFixture<AppFeedPlacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppFeedPlacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFeedPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
