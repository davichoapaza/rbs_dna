import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirecionDna } from './direcion-dna';

describe('DirecionDna', () => {
  let component: DirecionDna;
  let fixture: ComponentFixture<DirecionDna>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirecionDna],
    }).compileComponents();

    fixture = TestBed.createComponent(DirecionDna);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
