import { ViewportScroller } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StudentInClassComponent } from 'src/app/manager-dashboard/schedule/student-in-class/student-in-class.component';
import { LoginResponse } from 'src/interfaces/Account';
import { ClassArray, ClassResponse } from 'src/interfaces/Class';
import { SessionList, SessionResponse } from 'src/interfaces/Session';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';

@Component({
  selector: 'app-class-teacher',
  templateUrl: './class-teacher.component.html',
  styleUrls: ['./class-teacher.component.scss'],
})
export class ClassTeacherComponent implements OnInit {
  constructor(
    private localStorage: LocalStorageService,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private viewportScroller: ViewportScroller
  ) {}

  today?: Date;
  listTitle: string = 'Danh sách lớp đang dạy';
  isLoading: boolean = true;
  isLoadingSession: boolean = false;
  classArray?: Array<ClassResponse>;
  //paging
  totalPage?: number;
  currentPage?: number;
  pageArray?: Array<number>;
  //clickId
  clickedId: number = 0;
  //for search
  status: string = 'studying';
  //
  teacher?: LoginResponse;
  url?: string;
  username?: string;
  openingDate?: string;

  //form session
  form: FormGroup = this.formBuilder.group({
    teacherName: [''],
    roomName: [''],
    date: [''],
    startTime: [''],
    endTime: [''],
  });
  startTime?: string;
  date?: string;
  endTime?: string;
  classModel?: ClassResponse;
  sessionArray?: Array<SessionResponse>;
  clickedSession?: SessionResponse;
  //point
  midpoint1: number = 0;
  midpoint2: number = 0;
  midpoint3: number = 0;

  ngOnInit(): void {
    this.today = new Date();
    this.teacher = this.localStorage.get('user');
    this.url = this.teacher?.image;
    this.username = this.teacher?.username;
    if (this.username) this.getClassAll(this.username, this.status, 1);
  }

  changeTitle(name: string): void {
    this.listTitle = name;
    if (name === 'Danh sách lớp chờ khai giảng') {
      this.status = 'waiting';
    } else if (name === 'Danh sách lớp đang dạy') {
      this.status = 'studying';
    } else if (name === 'Danh sách lớp đã kết thúc') {
      this.status = 'finished';
    }
    if (this.username) this.getClassAll(this.username, this.status, 1);
  }

  getClassAll(username: string, status: string, pageNo: number): void {
    this.isLoading = true;
    this.resetForm();
    this.api
      .searchClassByTeacherUsernameAndStatus(username, status, pageNo, 13)
      .subscribe(
        (response: ClassArray) => {
          this.classArray = response.classList;
          this.totalPage = response.totalPage;
          this.pageArray = Array(this.totalPage)
            .fill(1)
            .map((x, i) => i + 1)
            .reverse();
          this.currentPage = response.pageNo;
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.isLoading = false;
          this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
        }
      );
  }

  changePage(pageNo: number) {
    if (this.username) this.getClassAll(this.username, this.status, pageNo);
  }

  getSession(c: ClassResponse): void {
    this.isLoadingSession = true;
    this.classModel = c;
    if (this.classModel?.classId) {
      this.clickedId = this.classModel.classId;
      this.api.getSessionInClass(this.classModel.classId, 1, 1000).subscribe(
        (response: SessionList) => {
          this.sessionArray = response.sessionList;
          if (this.sessionArray) {
            this.midpoint1 = Math.ceil(this.sessionArray?.length / 3);
            this.midpoint2 = this.midpoint1 * 2;
            this.midpoint3 = this.sessionArray.length;
          }
          this.isLoadingSession = false;
          this.viewportScroller.scrollToAnchor('session');
        },
        (error) => {
          console.log(error);
          this.isLoadingSession = false;
          this.callAlert(
            'Ok',
            'Có lỗi xảy ra khi tải các buổi học, vui lòng thử lại'
          );
        }
      );
    }
  }

  setForm(session: SessionResponse) {
    this.clickedSession = session;
    this.clickedId = session.sessionId;
    this.form.controls.teacherName.setValue(this.clickedSession.teacherName);
    this.form.controls.roomName.setValue(this.clickedSession.roomName);
    this.startTime = session.startTime;
    this.date = session.startTime;
    this.endTime = session.endTime;
  }

  resetForm() {
    this.startTime = undefined;
    this.date = undefined;
    this.endTime = undefined;
    this.clickedSession = undefined;
    this.classModel = undefined;
    this.clickedId = 0;
    this.form.reset();
  }

  goToAttendance() {
    this.router.navigateByUrl('/teacher-dashboard/attendance');
  }

  viewStudentInClass(classId: number | undefined) {
    let dialogRef = this.dialog.open(StudentInClassComponent, {
      data: { classId: classId },
    });
  }

  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  doYes(): void {
    this.haveAlertYN = false;
  }

  doNo(): void {
    this.haveAlertYN = false;
  }

  callAlert(type: string, message: string, param?: any) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
    }
    this.clickedId = param;
  }
}
