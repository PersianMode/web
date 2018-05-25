import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyDictionaryComponent } from './modify-dictionary.component';

describe('ModifyDictionaryComponent', () => {
  let component: ModifyDictionaryComponent;
  let fixture: ComponentFixture<ModifyDictionaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyDictionaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyDictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
