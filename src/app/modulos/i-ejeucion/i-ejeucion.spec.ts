import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IEjeucion } from './i-ejeucion';

describe('IEjeucion', () => {
  let component: IEjeucion;
  let fixture: ComponentFixture<IEjeucion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IEjeucion],
    }).compileComponents();

    fixture = TestBed.createComponent(IEjeucion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
