import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DDireccionInicio } from './d-direccion-inicio';

describe('DDireccionInicio', () => {
  let component: DDireccionInicio;
  let fixture: ComponentFixture<DDireccionInicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DDireccionInicio],
    }).compileComponents();

    fixture = TestBed.createComponent(DDireccionInicio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
