import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredDateDialogComponent } from './expired-date-dialog.component';

describe('ExpiredDateDialogComponent', () => {
  let component: ExpiredDateDialogComponent;
  let fixture: ComponentFixture<ExpiredDateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiredDateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredDateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
