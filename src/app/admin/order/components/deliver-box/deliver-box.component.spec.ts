import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverBoxComponent } from './deliver-box.component';

describe('OutBoxComponent', () => {
  let component: DeliverBoxComponent;
  let fixture: ComponentFixture<DeliverBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliverBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
