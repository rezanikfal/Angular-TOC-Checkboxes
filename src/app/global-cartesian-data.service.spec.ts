import { TestBed } from '@angular/core/testing';

import { GlobalCartesianDataService } from './global-cartesian-data.service';

describe('GlobalCartesianDataService', () => {
  let service: GlobalCartesianDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalCartesianDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
