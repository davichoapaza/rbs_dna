import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JBandejaRevision } from './j-bandeja-revision';

describe('JBandejaRevision', () => {
  let component: JBandejaRevision;
  let fixture: ComponentFixture<JBandejaRevision>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JBandejaRevision],
    }).compileComponents();

    fixture = TestBed.createComponent(JBandejaRevision);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
