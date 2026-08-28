import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JDesignarInspector } from './j-designar-inspector';

describe('JDesignarInspector', () => {
  let component: JDesignarInspector;
  let fixture: ComponentFixture<JDesignarInspector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JDesignarInspector],
    }).compileComponents();

    fixture = TestBed.createComponent(JDesignarInspector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
