import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCollectionComponent } from './main-collection.component';

describe('MainCollectionComponent', () => {
  let component: MainCollectionComponent;
  let fixture: ComponentFixture<MainCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
