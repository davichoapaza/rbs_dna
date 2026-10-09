import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsignarInspector } from './modal-asignar-inspector';

describe('ModalAsignarInspector', () => {
  let component: ModalAsignarInspector;
  let fixture: ComponentFixture<ModalAsignarInspector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAsignarInspector],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAsignarInspector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
