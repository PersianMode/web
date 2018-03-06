import { TestBed, inject } from '@angular/core/testing';

import { ResponsiveService } from './responsive.service';

describe('ResponsiveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResponsiveService]
    });
  });

  it('should be created', inject([ResponsiveService], (service: ResponsiveService) => {
    expect(service).toBeTruthy();
  }));
});
