import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IAsignaciones } from './i-asignaciones';

describe('IAsignaciones', () => {
  let component: IAsignaciones;
  let fixture: ComponentFixture<IAsignaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IAsignaciones],
    }).compileComponents();

    fixture = TestBed.createComponent(IAsignaciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
