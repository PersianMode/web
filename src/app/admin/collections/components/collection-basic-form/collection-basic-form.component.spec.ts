import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionBasicFormComponent } from './collection-basic-form.component';

describe('CollectionBasicFormComponent', () => {
  let component: CollectionBasicFormComponent;
  let fixture: ComponentFixture<CollectionBasicFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionBasicFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionBasicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
