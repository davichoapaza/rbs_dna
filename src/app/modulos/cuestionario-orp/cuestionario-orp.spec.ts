import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuestionarioOrp } from './cuestionario-orp';

describe('CuestionarioOrp', () => {
  let component: CuestionarioOrp;
  let fixture: ComponentFixture<CuestionarioOrp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuestionarioOrp],
    }).compileComponents();

    fixture = TestBed.createComponent(CuestionarioOrp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
