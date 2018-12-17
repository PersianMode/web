import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelvsViewComponent } from './shelvs-view.component';

describe('ShelvsViewComponent', () => {
  let component: ShelvsViewComponent;
  let fixture: ComponentFixture<ShelvsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShelvsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelvsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
