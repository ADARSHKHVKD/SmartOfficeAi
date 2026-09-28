import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLeaves } from './admin-leaves';

describe('AdminLeaves', () => {
  let component: AdminLeaves;
  let fixture: ComponentFixture<AdminLeaves>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLeaves]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLeaves);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
