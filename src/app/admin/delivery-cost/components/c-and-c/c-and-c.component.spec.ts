import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CAndCComponent } from './c-and-c.component';

describe('CAndCComponent', () => {
  let component: CAndCComponent;
  let fixture: ComponentFixture<CAndCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CAndCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CAndCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
