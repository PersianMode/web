import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTagComponent } from './collection-tag.component';

describe('CollectionTagComponent', () => {
  let component: CollectionTagComponent;
  let fixture: ComponentFixture<CollectionTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
