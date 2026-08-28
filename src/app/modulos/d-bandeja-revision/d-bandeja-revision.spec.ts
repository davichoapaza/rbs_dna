import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DBandejaRevision } from './d-bandeja-revision';

describe('DBandejaRevision', () => {
  let component: DBandejaRevision;
  let fixture: ComponentFixture<DBandejaRevision>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DBandejaRevision],
    }).compileComponents();

    fixture = TestBed.createComponent(DBandejaRevision);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
