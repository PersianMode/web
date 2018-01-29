import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentCollectionComponent } from './parent-collection.component';

describe('ParentCollectionComponent', () => {
  let component: ParentCollectionComponent;
  let fixture: ComponentFixture<ParentCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
