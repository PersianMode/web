import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionFullInfoComponent } from './collection-full-info.component';

describe('CollectionFullInfoComponent', () => {
  let component: CollectionFullInfoComponent;
  let fixture: ComponentFixture<CollectionFullInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionFullInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionFullInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
