import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MismatchConfirmComponent } from './mismatch-confirm.component';

describe('MismatchConfirmComponent', () => {
  let component: MismatchConfirmComponent;
  let fixture: ComponentFixture<MismatchConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MismatchConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MismatchConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
