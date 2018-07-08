import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoyaltyGroupComponent } from './loyaltygroup.component';

describe('LoyaltyGroupComponent', () => {
  let component: LoyaltyGroupComponent;
  let fixture: ComponentFixture<LoyaltyGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
