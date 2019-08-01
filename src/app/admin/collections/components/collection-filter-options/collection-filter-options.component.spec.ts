import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionFilterOptionsComponent } from './collection-filter-options.component';

describe('CollectionFilterOptionsComponent', () => {
  let component: CollectionFilterOptionsComponent;
  let fixture: ComponentFixture<CollectionFilterOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionFilterOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionFilterOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
