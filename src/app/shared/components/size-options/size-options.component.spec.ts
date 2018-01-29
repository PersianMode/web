import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeOptionsComponent } from './size-options.component';

describe('SizeOptionsComponent', () => {
  let component: SizeOptionsComponent;
  let fixture: ComponentFixture<SizeOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SizeOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SizeOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
