import { TestBed } from '@angular/core/testing';

import { ServiceMockService } from './service-mock.service';

describe('ServiceMockService', () => {
  let service: ServiceMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
