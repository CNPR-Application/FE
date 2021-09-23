import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { BranchComponent } from './dashboard/branch/branch.component';
import { CurriculumComponent } from './dashboard/curriculum/curriculum.component';
import { DetailCurriculumComponent } from './dashboard/detail-curriculum/detail-curriculum.component';
import { InfoComponent } from './dashboard/info/info.component';
import { ShiftComponent } from './dashboard/shift/shift.component';
import { StaffComponent } from './dashboard/staff/staff.component';
import { SubjectDetailComponent } from './dashboard/subject-detail/subject-detail.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { ClassManagementComponent } from './manager-dashboard/class-management/class-management.component';
import { GuestMainComponent } from './guest-main/guest-main.component';
import { GuestBookingComponent } from './manager-dashboard/guest-booking/guest-booking.component';
import { ClassSuggestionComponent } from './manager-dashboard/class-suggestion/class-suggestion.component';
import { ScheduleComponent } from './manager-dashboard/schedule/schedule.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { AttendanceComponent } from './teacher-dashboard/attendance/attendance.component';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: GuestMainComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'curriculum', component: CurriculumComponent },
      { path: 'detail-curriculum', component: DetailCurriculumComponent },
      { path: 'detail-subject', component: SubjectDetailComponent },
      { path: 'branch', component: BranchComponent },
      { path: 'info', component: InfoComponent },
      { path: 'shift', component: ShiftComponent },
      { path: 'staff', component: StaffComponent },
    ],
  },
  {
    path: 'manager-dashboard',
    component: ManagerDashboardComponent,
    children: [
      { path: 'class-management', component: ClassManagementComponent },
      { path: 'guest-booking', component: GuestBookingComponent },
      { path: 'class-suggestion', component: ClassSuggestionComponent },
      { path: 'schedule', component: ScheduleComponent },
    ],
  },
  {
    path: 'teacher-dashboard',
    component: TeacherDashboardComponent,
    children: [{ path: 'attendance', component: AttendanceComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
