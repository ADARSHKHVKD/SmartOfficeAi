import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerLeave } from './manager-leave';

describe('ManagerLeave', () => {
  let component: ManagerLeave;
  let fixture: ComponentFixture<ManagerLeave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerLeave]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerLeave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
