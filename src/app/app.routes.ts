import { Routes } from '@angular/router';

import { Login } from './components/login/login';
import { Layout } from './components/layout/layout';
import { Dashboard } from './components/dashboard/dashboard';
import { Tasklist } from './components/tasklist/tasklist';
import { Addtask } from './components/addtask/addtask';
import { Leave } from './components/leave/leave';
import { ManagerLeave } from './components/manager-leave/manager-leave';
import { Timesheet } from './components/timesheet/timesheet';
import { ManagerTimesheet } from './components/manager-timesheet/manager-timesheet';
import { Attendance } from './components/attendance/attendance';
import { ManagerAttendance } from './components/manager-attendance/manager-attendance';
import { authGuard } from './guards/auth-guard';
import { AdminUsers } from './components/admin-users/admin-users';
import { ManagerDashboard } from './components/manager-dashboard/manager-dashboard';
import { AdminDepartments } from './components/admin-departments/admin-departments';
import { AdminTasks } from './components/admin-tasks/admin-tasks';
import { AdminLeaves } from './components/admin-leaves/admin-leaves';
export const routes: Routes = [

  {
    path: 'login',
    component: Login
  },

  {
    path: '',
    component: Layout,
    canActivate: [authGuard],

    children: [

      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'admin-tasks',
        component: AdminTasks
      },

      {
        path: 'tasks',
        component: Tasklist
      },
      {
        path: 'admin-leaves',
        component: AdminLeaves
      },

      {
        path: 'timesheets',
        component: Timesheet
      },
      {
        path: 'attendance',
        component: Attendance
      },
      {
        path: 'manager-attendance',
        component: ManagerAttendance
      },
      {
        path: 'admin-users',
        component: AdminUsers
      },
      {
        path: 'admin-departments',
        component: AdminDepartments
      },
      {
        path: 'manager-timesheets',
        component: ManagerTimesheet
      },

      {
        path: 'addtask',
        component: Addtask
      },

      {
        path: 'addtask/:id',
        component: Addtask
      },

      {
        path: 'leave',
        component: Leave
      },

      {
        path: 'manager-leave',
        component: ManagerLeave
      },
      {
        path: 'manager-dashboard',
        component: ManagerDashboard
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];