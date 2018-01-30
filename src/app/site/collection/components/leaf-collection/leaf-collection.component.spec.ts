import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeafCollectionComponent } from './leaf-collection.component';

describe('LeafCollectionComponent', () => {
  let component: LeafCollectionComponent;
  let fixture: ComponentFixture<LeafCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeafCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeafCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
