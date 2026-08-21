import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacionNcr } from './verificacion-ncr';

describe('VerificacionNcr', () => {
  let component: VerificacionNcr;
  let fixture: ComponentFixture<VerificacionNcr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificacionNcr],
    }).compileComponents();

    fixture = TestBed.createComponent(VerificacionNcr);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
