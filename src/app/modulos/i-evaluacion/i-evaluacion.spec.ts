import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IEvaluacion } from './i-evaluacion';

describe('IEvaluacion', () => {
  let component: IEvaluacion;
  let fixture: ComponentFixture<IEvaluacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IEvaluacion],
    }).compileComponents();

    fixture = TestBed.createComponent(IEvaluacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
