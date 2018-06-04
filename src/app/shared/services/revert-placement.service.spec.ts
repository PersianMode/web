import { TestBed, inject } from '@angular/core/testing';

import { RevertPlacementService } from './revert-placement.service';

describe('RevertPlacementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RevertPlacementService]
    });
  });

  it('should be created', inject([RevertPlacementService], (service: RevertPlacementService) => {
    expect(service).toBeTruthy();
  }));
});
