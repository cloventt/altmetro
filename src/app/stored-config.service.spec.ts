import { TestBed } from '@angular/core/testing';

import { StoredConfigService } from './stored-config.service';

describe('StoredConfigService', () => {
  let service: StoredConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoredConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
