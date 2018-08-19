import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPlacementComponent } from './footer-placement.component';

describe('FooterPlacementComponent', () => {
  let component: FooterPlacementComponent;
  let fixture: ComponentFixture<FooterPlacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterPlacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
