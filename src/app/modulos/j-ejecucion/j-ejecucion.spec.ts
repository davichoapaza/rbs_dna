import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JEjecucion } from './j-ejecucion';

describe('JEjecucion', () => {
  let component: JEjecucion;
  let fixture: ComponentFixture<JEjecucion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JEjecucion],
    }).compileComponents();

    fixture = TestBed.createComponent(JEjecucion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
