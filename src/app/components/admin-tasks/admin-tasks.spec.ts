import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTasks } from './admin-tasks';

describe('AdminTasks', () => {
  let component: AdminTasks;
  let fixture: ComponentFixture<AdminTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTasks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
