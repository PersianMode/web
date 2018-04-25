import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDictionaryComponent } from './add-dictionary.component';

describe('AddDictionaryComponent', () => {
  let component: AddDictionaryComponent;
  let fixture: ComponentFixture<AddDictionaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDictionaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
