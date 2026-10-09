import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarInspector } from './asignar-inspector';

describe('AsignarInspector', () => {
  let component: AsignarInspector;
  let fixture: ComponentFixture<AsignarInspector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarInspector],
    }).compileComponents();

    fixture = TestBed.createComponent(AsignarInspector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
