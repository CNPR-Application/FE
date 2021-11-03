import { DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ClickOutsideModule } from 'ng-click-outside';
import { MessagingService } from '../service/messaging.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BranchDialogComponent } from './dashboard/branch/branch-dialog/branch-dialog.component';
import { BranchComponent } from './dashboard/branch/branch.component';
import { CurriculumComponent } from './dashboard/curriculum/curriculum.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailCurriculumComponent } from './dashboard/detail-curriculum/detail-curriculum.component';
import { AvatarDialogComponent } from './dashboard/info/avatar-dialog/avatar-dialog.component';
import { InfoComponent } from './dashboard/info/info.component';
import { MenuComponent } from './dashboard/menu/menu.component';
import { NotificationAdminDialogComponent } from './dashboard/notification-admin-dialog/notification-admin-dialog.component';
import { ShiftDialogComponent } from './dashboard/shift/shift-dialog/shift-dialog.component';
import { ShiftComponent } from './dashboard/shift/shift.component';
import { StaffDialogComponent } from './dashboard/staff/staff-dialog/staff-dialog.component';
import { StaffComponent } from './dashboard/staff/staff.component';
import { SubjectDetailComponent } from './dashboard/subject-detail/subject-detail.component';
import { SubjectDialogComponent } from './dashboard/subject-detail/subject-dialog/subject-dialog.component';
import { GuestMainComponent } from './guest-main/guest-main.component';
import { LoginComponent } from './login/login.component';
import { ClassCreateComponent } from './manager-dashboard/class-management/class-create/class-create.component';
import { ClassManagementComponent } from './manager-dashboard/class-management/class-management.component';
import { ClassSuggestionComponent } from './manager-dashboard/class-suggestion/class-suggestion.component';
import { FeedbackComponent } from './manager-dashboard/feedback/feedback.component';
import { BookingCreateComponent } from './manager-dashboard/guest-booking/booking-create/booking-create.component';
import { GuestBookingComponent } from './manager-dashboard/guest-booking/guest-booking.component';
import { StatusDialogComponent } from './manager-dashboard/guest-booking/status-dialog/status-dialog.component';
import { ManagerAttendanceComponent } from './manager-dashboard/manager-attendance/manager-attendance.component';
import { ReopenDialogComponent } from './manager-dashboard/manager-attendance/reopen-dialog/reopen-dialog.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { ManagerAvatarComponent } from './manager-dashboard/manager-info/manager-avatar/manager-avatar.component';
import { ManagerInfoComponent } from './manager-dashboard/manager-info/manager-info.component';
import { ManagerMenuComponent } from './manager-dashboard/manager-menu/manager-menu.component';
import { NotificationDialogComponent } from './manager-dashboard/notification-dialog/notification-dialog.component';
import { RoomDialogComponent } from './manager-dashboard/room-management/room-dialog/room-dialog.component';
import { RoomManagementComponent } from './manager-dashboard/room-management/room-management.component';
import { ScheduleComponent } from './manager-dashboard/schedule/schedule.component';
import { StudentInClassComponent } from './manager-dashboard/schedule/student-in-class/student-in-class.component';
import { SessionDialogComponent } from './manager-dashboard/session-management/session-dialog/session-dialog.component';
import { SessionManagementComponent } from './manager-dashboard/session-management/session-management.component';
import { BookingStatusComponent } from './manager-dashboard/student-bookings/booking-status/booking-status.component';
import { StudentBookingsComponent } from './manager-dashboard/student-bookings/student-bookings.component';
import { StudentClassComponent } from './manager-dashboard/student-class/student-class.component';
import { CreateAccountComponent } from './manager-dashboard/student-management/create-account/create-account.component';
import { StudentManagementComponent } from './manager-dashboard/student-management/student-management.component';
import { TeacherClassComponent } from './manager-dashboard/teacher-class/teacher-class.component';
import { TeacherManagementComponent } from './manager-dashboard/teacher-management/teacher-management.component';
import { TeachingSubjectComponent } from './manager-dashboard/teacher-management/teaching-subject/teaching-subject.component';
import { MaterialModule } from './material/material.module';
import { AttendanceComponent } from './teacher-dashboard/attendance/attendance.component';
import { ClassTeacherComponent } from './teacher-dashboard/class-teacher/class-teacher.component';
import { NotificationTeacherDialogComponent } from './teacher-dashboard/notification-teacher-dialog/notification-teacher-dialog.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { TeacherAvatarComponent } from './teacher-dashboard/teacher-info/teacher-avatar/teacher-avatar.component';
import { TeacherInfoComponent } from './teacher-dashboard/teacher-info/teacher-info.component';
import { TeacherMenuComponent } from './teacher-dashboard/teacher-menu/teacher-menu.component';
import { TeacherScheduleComponent } from './teacher-dashboard/teacher-schedule/teacher-schedule.component';
import { TeacherSubjectComponent } from './teacher-dashboard/teacher-subject/teacher-subject.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    MenuComponent,
    CurriculumComponent,
    StaffComponent,
    BranchComponent,
    InfoComponent,
    ShiftComponent,
    DetailCurriculumComponent,
    SubjectDetailComponent,
    SubjectDialogComponent,
    BranchDialogComponent,
    ShiftDialogComponent,
    AvatarDialogComponent,
    StaffDialogComponent,
    ManagerDashboardComponent,
    ManagerMenuComponent,
    ClassManagementComponent,
    ClassCreateComponent,
    GuestMainComponent,
    GuestBookingComponent,
    BookingCreateComponent,
    StatusDialogComponent,
    ClassSuggestionComponent,
    ScheduleComponent,
    StudentInClassComponent,
    TeacherDashboardComponent,
    AttendanceComponent,
    TeacherMenuComponent,
    FeedbackComponent,
    NotificationDialogComponent,
    NotificationAdminDialogComponent,
    NotificationTeacherDialogComponent,
    ManagerAttendanceComponent,
    ManagerInfoComponent,
    ManagerAvatarComponent,
    TeacherInfoComponent,
    TeacherAvatarComponent,
    StudentManagementComponent,
    TeacherManagementComponent,
    TeachingSubjectComponent,
    StudentClassComponent,
    TeacherClassComponent,
    StudentBookingsComponent,
    BookingStatusComponent,
    CreateAccountComponent,
    RoomManagementComponent,
    RoomDialogComponent,
    SessionManagementComponent,
    SessionDialogComponent,
    ReopenDialogComponent,
    ClassTeacherComponent,
    TeacherScheduleComponent,
    TeacherSubjectComponent,
  ],
  entryComponents: [
    SubjectDialogComponent,
    BranchDialogComponent,
    ShiftDialogComponent,
    AvatarDialogComponent,
    StaffDialogComponent,
    ClassCreateComponent,
    BookingCreateComponent,
    StatusDialogComponent,
    NotificationDialogComponent,
    NotificationAdminDialogComponent,
    NotificationTeacherDialogComponent,
    ManagerAvatarComponent,
    TeacherAvatarComponent,
    TeachingSubjectComponent,
    BookingStatusComponent,
    CreateAccountComponent,
    RoomDialogComponent,
    SessionDialogComponent,
    ReopenDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    NgxChartsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularFireStorageModule,
    ClickOutsideModule,
    AngularFireMessagingModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyDpAOynBW6XsCygjz_AIQkz2oAmp9a_-Tc',
      authDomain: 'app-test-c1bfb.firebaseapp.com',
      projectId: 'app-test-c1bfb',
      storageBucket: 'app-test-c1bfb.appspot.com',
      messagingSenderId: '399453444594',
      appId: '1:399453444594:web:0e2145dc7d04548d5c336b',
      measurementId: 'G-DNB0913N47',
    }),
    DragDropModule,
  ],
  providers: [DatePipe, MessagingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
