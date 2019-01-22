import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmReportComponent } from './sm-report.component';

describe('SmReportComponent', () => {
  let component: SmReportComponent;
  let fixture: ComponentFixture<SmReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
