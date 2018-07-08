import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchHandleComponent } from './search-handle.component';

describe('SearchHandleComponent', () => {
  let component: SearchHandleComponent;
  let fixture: ComponentFixture<SearchHandleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchHandleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchHandleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
