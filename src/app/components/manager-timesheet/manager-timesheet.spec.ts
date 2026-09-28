import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerTimesheet } from './manager-timesheet';

describe('ManagerTimesheet', () => {
  let component: ManagerTimesheet;
  let fixture: ComponentFixture<ManagerTimesheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerTimesheet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerTimesheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
