import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTypeComponent } from './collection-type.component';

describe('CollectionTypeComponent', () => {
  let component: CollectionTypeComponent;
  let fixture: ComponentFixture<CollectionTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
