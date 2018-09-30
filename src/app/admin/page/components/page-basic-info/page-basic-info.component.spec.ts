import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBasicInfoComponent } from './page-basic-info.component';

describe('CollectionBasicFormComponent', () => {
  let component: PageBasicInfoComponent;
  let fixture: ComponentFixture<PageBasicInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageBasicInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
