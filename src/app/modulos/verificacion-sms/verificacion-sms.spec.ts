import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacionSms } from './verificacion-sms';

describe('VerificacionSms', () => {
  let component: VerificacionSms;
  let fixture: ComponentFixture<VerificacionSms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificacionSms],
    }).compileComponents();

    fixture = TestBed.createComponent(VerificacionSms);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
