import { TestBed } from '@angular/core/testing';

import { MetroinfoApiService } from './metroinfo-api.service';

describe('MetroinfoApiService', () => {
  let service: MetroinfoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetroinfoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
