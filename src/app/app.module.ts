import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuComponent } from './dashboard/menu/menu.component';
import { CurriculumComponent } from './dashboard/curriculum/curriculum.component';
import { StaffComponent } from './dashboard/staff/staff.component';
import { BranchComponent } from './dashboard/branch/branch.component';
import { InfoComponent } from './dashboard/info/info.component';
import { ShiftComponent } from './dashboard/shift/shift.component';
import { DetailCurriculumComponent } from './dashboard/detail-curriculum/detail-curriculum.component';
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { SubjectDetailComponent } from './dashboard/subject-detail/subject-detail.component';
import { SubjectDialogComponent } from './dashboard/subject-detail/subject-dialog/subject-dialog.component';
import { BranchDialogComponent } from './dashboard/branch/branch-dialog/branch-dialog.component';
import { ShiftDialogComponent } from './dashboard/shift/shift-dialog/shift-dialog.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AvatarDialogComponent } from './dashboard/info/avatar-dialog/avatar-dialog.component';
import { StaffDialogComponent } from './dashboard/staff/staff-dialog/staff-dialog.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { ManagerMenuComponent } from './manager-dashboard/manager-menu/manager-menu.component';
import { ClassManagementComponent } from './manager-dashboard/class-management/class-management.component';
import { ClassCreateComponent } from './manager-dashboard/class-management/class-create/class-create.component';
import { GuestMainComponent } from './guest-main/guest-main.component';
import { GuestBookingComponent } from './manager-dashboard/guest-booking/guest-booking.component';
import { BookingCreateComponent } from './manager-dashboard/guest-booking/booking-create/booking-create.component';
import { StatusDialogComponent } from './manager-dashboard/guest-booking/status-dialog/status-dialog.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ClassSuggestionComponent } from './manager-dashboard/class-suggestion/class-suggestion.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScheduleComponent } from './manager-dashboard/schedule/schedule.component';
import { StudentInClassComponent } from './manager-dashboard/schedule/student-in-class/student-in-class.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { AttendanceComponent } from './teacher-dashboard/attendance/attendance.component';
import { TeacherMenuComponent } from './teacher-dashboard/teacher-menu/teacher-menu.component';
import { FeedbackComponent } from './manager-dashboard/feedback/feedback.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { NotificationDialogComponent } from './manager-dashboard/notification-dialog/notification-dialog.component';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MessagingService } from '../service/messaging.service';
import { NotificationAdminDialogComponent } from './dashboard/notification-admin-dialog/notification-admin-dialog.component';
import { NotificationTeacherDialogComponent } from './teacher-dashboard/notification-teacher-dialog/notification-teacher-dialog.component';
import { ManagerAttendanceComponent } from './manager-dashboard/manager-attendance/manager-attendance.component';
import { ManagerInfoComponent } from './manager-dashboard/manager-info/manager-info.component';
import { ManagerAvatarComponent } from './manager-dashboard/manager-info/manager-avatar/manager-avatar.component';
import { TeacherInfoComponent } from './teacher-dashboard/teacher-info/teacher-info.component';
import { TeacherAvatarComponent } from './teacher-dashboard/teacher-info/teacher-avatar/teacher-avatar.component';

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
    TeacherAvatarComponent
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
