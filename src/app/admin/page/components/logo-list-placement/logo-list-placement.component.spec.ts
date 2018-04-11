import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoListPlacementComponent } from './logo-list-placement.component';

describe('LogoListPlacementComponent', () => {
  let component: LogoListPlacementComponent;
  let fixture: ComponentFixture<LogoListPlacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoListPlacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoListPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
