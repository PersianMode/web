import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSubMenuComponent } from './app-sub-menu.component';

describe('AppSubMenuComponent', () => {
  let component: AppSubMenuComponent;
  let fixture: ComponentFixture<AppSubMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSubMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSubMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
