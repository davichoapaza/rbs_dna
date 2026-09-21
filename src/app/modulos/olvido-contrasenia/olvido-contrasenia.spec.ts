import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlvidoContrasenia } from './olvido-contrasenia';

describe('OlvidoContrasenia', () => {
  let component: OlvidoContrasenia;
  let fixture: ComponentFixture<OlvidoContrasenia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlvidoContrasenia],
    }).compileComponents();

    fixture = TestBed.createComponent(OlvidoContrasenia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
