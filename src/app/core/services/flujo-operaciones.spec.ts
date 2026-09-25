import { TestBed } from '@angular/core/testing';

import { FlujoOperaciones } from './flujo-operaciones';

describe('FlujoOperaciones', () => {
  let service: FlujoOperaciones;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlujoOperaciones);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
