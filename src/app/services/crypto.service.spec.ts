import { TestBed } from '@angular/core/testing';

import { Crypto } from './crypto.service';

describe('Crypto', () => {
  let service: Crypto;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Crypto);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
