import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCardConfirmComponent } from './add-to-card-confirm.component';

describe('AddToCardConfirmComponent', () => {
  let component: AddToCardConfirmComponent;
  let fixture: ComponentFixture<AddToCardConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddToCardConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToCardConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
