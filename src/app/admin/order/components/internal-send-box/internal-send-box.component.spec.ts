import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalSendBoxComponent } from './internal-send-box.component';

describe('InternalSendBoxComponent', () => {
  let component: InternalSendBoxComponent;
  let fixture: ComponentFixture<InternalSendBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSendBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSendBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
