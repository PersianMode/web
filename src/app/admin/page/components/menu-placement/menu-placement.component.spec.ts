import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPlacementComponent } from './menu-placement.component';

describe('MenuPlacementComponent', () => {
  let component: MenuPlacementComponent;
  let fixture: ComponentFixture<MenuPlacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuPlacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
