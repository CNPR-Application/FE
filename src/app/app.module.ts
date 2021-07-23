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
import { NgxChartsModule }from '@swimlane/ngx-charts';
import { ClassSuggestionComponent } from './manager-dashboard/class-suggestion/class-suggestion.component';

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
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyBAMMpbBeXOms18xvoNTPpPGCCnPoHQOgQ',
      authDomain: 'lcss-d2272.firebaseapp.com',
      projectId: 'lcss-d2272',
      storageBucket: 'lcss-d2272.appspot.com',
      messagingSenderId: '525406720486',
      appId: '1:525406720486:web:22964928381817a89b0627',
      measurementId: 'G-CVF3V0SBWN',
    }),
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
