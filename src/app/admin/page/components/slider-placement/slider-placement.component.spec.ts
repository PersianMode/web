import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderPlacementComponent } from './slider-placement.component';

describe('SliderPlacementComponent', () => {
  let component: SliderPlacementComponent;
  let fixture: ComponentFixture<SliderPlacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderPlacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
