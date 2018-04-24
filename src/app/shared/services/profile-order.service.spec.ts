import { TestBed, inject } from '@angular/core/testing';

import { ProfileOrderService } from './profile-order.service';

describe('ProfileOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileOrderService]
    });
  });

  it('should be created', inject([ProfileOrderService], (service: ProfileOrderService) => {
    expect(service).toBeTruthy();
  }));
});
