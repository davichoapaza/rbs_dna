import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JModalDesignarInspector } from './j-modal-designar-inspector';

describe('JModalDesignarInspector', () => {
  let component: JModalDesignarInspector;
  let fixture: ComponentFixture<JModalDesignarInspector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JModalDesignarInspector],
    }).compileComponents();

    fixture = TestBed.createComponent(JModalDesignarInspector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
