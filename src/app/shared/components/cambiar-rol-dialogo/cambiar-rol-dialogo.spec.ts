import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarRolDialogo } from './cambiar-rol-dialogo';

describe('CambiarRolDialogo', () => {
  let component: CambiarRolDialogo;
  let fixture: ComponentFixture<CambiarRolDialogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambiarRolDialogo],
    }).compileComponents();

    fixture = TestBed.createComponent(CambiarRolDialogo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
