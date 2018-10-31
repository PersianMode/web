import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveChangeConfirmComponent } from './save-change-confirm.component';

describe('SaveChangeConfirmComponent', () => {
  let component: SaveChangeConfirmComponent;
  let fixture: ComponentFixture<SaveChangeConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveChangeConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveChangeConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
