import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageContentPlacementComponent } from './page-content-placement.component';

describe('PageContentPlacementComponent', () => {
  let component: PageContentPlacementComponent;
  let fixture: ComponentFixture<PageContentPlacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageContentPlacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageContentPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
