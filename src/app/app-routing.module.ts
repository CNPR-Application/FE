import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchComponent } from './dashboard/branch/branch.component';
import { CurriculumComponent } from './dashboard/curriculum/curriculum.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailCurriculumComponent } from './dashboard/detail-curriculum/detail-curriculum.component';
import { InfoComponent } from './dashboard/info/info.component';
import { ShiftComponent } from './dashboard/shift/shift.component';
import { StaffComponent } from './dashboard/staff/staff.component';
import { SubjectDetailComponent } from './dashboard/subject-detail/subject-detail.component';
import { GuestMainComponent } from './guest-main/guest-main.component';
import { LoginComponent } from './login/login.component';
import { ClassManagementComponent } from './manager-dashboard/class-management/class-management.component';
import { ClassSuggestionComponent } from './manager-dashboard/class-suggestion/class-suggestion.component';
import { FeedbackComponent } from './manager-dashboard/feedback/feedback.component';
import { GuestBookingComponent } from './manager-dashboard/guest-booking/guest-booking.component';
import { ManagerAttendanceComponent } from './manager-dashboard/manager-attendance/manager-attendance.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { ManagerInfoComponent } from './manager-dashboard/manager-info/manager-info.component';
import { RoomManagementComponent } from './manager-dashboard/room-management/room-management.component';
import { ScheduleComponent } from './manager-dashboard/schedule/schedule.component';
import { SessionManagementComponent } from './manager-dashboard/session-management/session-management.component';
import { StudentBookingsComponent } from './manager-dashboard/student-bookings/student-bookings.component';
import { StudentClassComponent } from './manager-dashboard/student-class/student-class.component';
import { StudentManagementComponent } from './manager-dashboard/student-management/student-management.component';
import { TeacherClassComponent } from './manager-dashboard/teacher-class/teacher-class.component';
import { TeacherManagementComponent } from './manager-dashboard/teacher-management/teacher-management.component';
import { AttendanceComponent } from './teacher-dashboard/attendance/attendance.component';
import { ClassTeacherComponent } from './teacher-dashboard/class-teacher/class-teacher.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { TeacherInfoComponent } from './teacher-dashboard/teacher-info/teacher-info.component';
import { TeacherScheduleComponent } from './teacher-dashboard/teacher-schedule/teacher-schedule.component';

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
      { path: 'feedback', component: FeedbackComponent },
      { path: 'attendance', component: ManagerAttendanceComponent },
      { path: 'info', component: ManagerInfoComponent },
      { path: 'session', component: SessionManagementComponent },
      { path: 'room', component: RoomManagementComponent },
      { path: 'student', component: StudentManagementComponent },
      { path: 'student-class', component: StudentClassComponent },
      { path: 'student-bookings', component: StudentBookingsComponent },
      { path: 'teacher', component: TeacherManagementComponent },
      { path: 'teacher-class', component: TeacherClassComponent },
    ],
  },
  {
    path: 'teacher-dashboard',
    component: TeacherDashboardComponent,
    children: [
      { path: 'attendance', component: AttendanceComponent },
      { path: 'info', component: TeacherInfoComponent },
      { path: 'class', component: ClassTeacherComponent },
      { path: 'schedule', component: TeacherScheduleComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
