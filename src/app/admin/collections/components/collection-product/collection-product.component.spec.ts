import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionProductComponent } from './collection-product.component';

describe('CollectionProductComponent', () => {
  let component: CollectionProductComponent;
  let fixture: ComponentFixture<CollectionProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
