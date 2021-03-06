import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  SessionStatus
} from 'src/app/teacher-dashboard/attendance/attendance';
import { LoginResponse } from 'src/interfaces/Account';
import {
  AttendanceList,
  AttendanceReopenRequest
} from 'src/interfaces/Attendance';
import { ClassArray, ClassResponse } from 'src/interfaces/Class';
import { NotiPersonRequest } from 'src/interfaces/Notification';
import { SessionList, SessionResponse } from 'src/interfaces/Session';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';
import {
  AttendanceCheckingManager,
  AttendanceManagerClass
} from './manager-attendance';
import { ReopenDialogComponent } from './reopen-dialog/reopen-dialog.component';

@Component({
  selector: 'app-manager-attendance',
  templateUrl: './manager-attendance.component.html',
  styleUrls: ['./manager-attendance.component.scss'],
})
export class ManagerAttendanceComponent implements OnInit {
  constructor(
    private localStorage: LocalStorageService,
    private api: ApiService,
    private dialog: MatDialog
  ) {}

  today: Date = new Date();
  branchId?: number;
  status: string = 'studying';
  classId?: number;
  sessionId?: number;
  sessionStatus?: string;
  selectedSession?: SessionResponse;
  selectedClass?: ClassResponse;

  // isLoading
  isLoadingClass: boolean = false;
  isLoadingSession: boolean = false;
  isLoadingAttendance: boolean = false;
  editLoading: boolean = false;

  // array
  classArray?: Array<ClassResponse>;
  sessionArray?: Array<SessionResponse>;
  attendanceArray?: Array<AttendanceCheckingManager>;
  pageArray?: Array<number>;
  currentPage?: number = 1;

  //midpoint
  midpoint: number = 0;
  endpoint: number = 0;

  // edit attendance
  statusAttendanceArray?: Array<AttendanceManagerClass>;
  statusSession?: Array<SessionStatus>;

  //reopen
  isReopen: boolean = false;
  closingDate?: string;

  ngOnInit(): void {
    let user: LoginResponse = this.localStorage.get('user');
    this.branchId = user.branchId;
    this.getClass();
  }

  getClass(): void {
    this.isLoadingClass = true;
    if (this.branchId && this.currentPage) {
      this.api
        .getClassByBranch(this.branchId, this.status, this.currentPage, 20)
        .subscribe(
          (response: ClassArray) => {
            this.classArray = response.classList;
            this.pageArray = Array(response.totalPage)
              .fill(1)
              .map((x, i) => i + 1);
            this.currentPage = response.pageNo;
            this.isLoadingClass = false;
            if (this.classArray) {
              this.classId = this.classArray[0].classId;
              this.getSession(this.classId);
            }
          },
          (error) => {
            console.log(error);
            this.isLoadingClass = false;
            this.callAlert(
              'Ok',
              'C?? l???i x???y ra khi t???i l???p h???c, vui l??ng th??? l???i'
            );
          }
        );
    }
  }

  changeStatusClass(status: string) {
    if (this.status != status) {
      this.status = status;
      this.currentPage = 1;
      this.getClass();
    }
  }

  changePage(pageNo: number) {
    this.currentPage = pageNo;
    this.getClass();
  }

  getSession(classId?: number): void {
    this.isLoadingSession = true;
    this.classId = classId;
    this.attendanceArray = undefined;
    this.statusAttendanceArray = undefined;
    if (classId) {
      this.api.getSessionInClass(classId, 1, 1000).subscribe(
        (response: SessionList) => {
          this.sessionArray = response.sessionList;
          this.statusSession = [];
          if (this.sessionArray) {
            for (let i = 0; i < this.sessionArray?.length; i++) {
              let s = new SessionStatus(this.sessionArray[i]);
              this.statusSession.push(s);
              if (s.status === '??ang m???') {
                this.sessionId = s.sessionResponse.sessionId;
                this.selectedSession = s.sessionResponse;
                this.sessionStatus = s.status;
                this.getAttendance(this.sessionId);
              }
            }
          }
          this.isLoadingSession = false;
        },
        (error) => {
          console.log(error);
          this.isLoadingSession = false;
          this.callAlert(
            'Ok',
            'C?? l???i x???y ra khi t???i c??c bu???i h???c, vui l??ng th??? l???i'
          );
        }
      );
    }
    if (this.classArray) {
      for (let i = 0; i < this.classArray.length; i++) {
        if (classId == this.classArray[i].classId) {
          this.selectedClass = this.classArray[i];
          break;
        }
      }
    }
  }

  getAttendance(sessionId?: number): void {
    this.isLoadingAttendance = true;
    this.sessionId = sessionId;
    this.attendanceArray = undefined;
    this.statusAttendanceArray = undefined;
    if (sessionId) {
      this.api.viewAttendanceInSession(sessionId, 1, 1000).subscribe(
        (response: AttendanceList) => {
          let array = response.attendanceList;
          this.attendanceArray = [];
          array.forEach((x) => {
            let y = new AttendanceCheckingManager(x);
            this.attendanceArray?.push(y);
            if (x.isReopen) {
              this.isReopen = true;
              this.closingDate = x.closingDate;
              this.sessionStatus = '??ang m???';
            } else {
              this.isReopen = false;
              this.closingDate = undefined;
            }
          });
          this.midpoint = this.attendanceArray.length / 2;
          this.endpoint = this.attendanceArray.length;
          this.isLoadingAttendance = false;
          this.statusAttendanceArray = [];
          if (this.attendanceArray)
            this.attendanceArray.forEach((x) => {
              let y = new AttendanceManagerClass(
                x.attendanceResponse.attendanceId,
                x.attendanceResponse.status
              );
              this.statusAttendanceArray?.push(y);
            });
        },
        (error) => {
          console.log(error);
          this.isLoadingAttendance = false;
          this.callAlert(
            'Ok',
            'C?? l???i x???y ra khi t???i ??i???m danh, vui l??ng th??? l???i'
          );
        }
      );
    }
  }

  changeSessionId(newSessionId: number) {
    if (this.statusSession)
      for (let i = 0; i < this.statusSession?.length; i++) {
        if (newSessionId == this.statusSession[i].sessionResponse.sessionId) {
          this.sessionId = newSessionId;
          this.selectedSession = this.statusSession[i].sessionResponse;
          this.sessionStatus = this.statusSession[i].status;
          this.getAttendance(newSessionId);
          break;
        }
      }
  }

  onItemChange(id: number, status: string, index: number) {
    if (this.attendanceArray && status === 'present') {
      this.attendanceArray[index].isPresent = true;
      this.attendanceArray[index].isAbsent = false;
    } else if (this.attendanceArray && status === 'absent') {
      this.attendanceArray[index].isPresent = false;
      this.attendanceArray[index].isAbsent = true;
    }
    if (this.statusAttendanceArray)
      for (let i = 0; i < this.statusAttendanceArray?.length; i++) {
        if (this.statusAttendanceArray[i].attendanceId == id) {
          this.statusAttendanceArray[i].status = status;
          break;
        }
      }
  }

  openDialog() {
    let dialogRef = this.dialog.open(ReopenDialogComponent, {
      data: {
        sessionId: this.selectedSession?.sessionId,
      },
    });
    dialogRef.afterClosed().subscribe((data) => {
      let request: AttendanceReopenRequest = data;
      this.api.reopenAttendance(request).subscribe(
        (response) => {
          if (response) {
            this.callAlert('Ok', 'M??? l???i ??i???m danh th??nh c??ng!');
            this.sendNotiToTeacher();
          } else {
            this.callAlert(
              'Ok',
              'C?? l???i x???y ra khi m??? l???i ??i???m danh, vui l??ng th??? l???i'
            );
          }
        },
        (error) => {
          console.log(error);
          this.callAlert(
            'Ok',
            'C?? l???i x???y ra khi m??? l???i ??i???m danh, vui l??ng th??? l???i'
          );
        }
      );
    });
  }

  sendNotiToTeacher() {
    let date;
    if (this.selectedSession?.startTime) {
      date = formatDate(this.selectedSession?.startTime, 'dd-MM-yyyy', 'en-US');
    }
    if (this.selectedClass?.teacherUsername) {
      let request: NotiPersonRequest = {
        receiverUsername: this.selectedClass?.teacherUsername,
        senderUsername: 'system',
        title:
          'Y??u c???u m??? l???i ??i???m danh t??? gi??o vi??n ' +
          this.selectedClass?.teacherName +
          ' ???? ???????c ch???p thu???n',
        body:
          'Y??u c???u m??? l???i ??i???m danh t??? gi??o vi??n ' +
          this.selectedClass?.teacherName +
          ' ?????i v???i l???p ' +
          this.selectedClass?.className +
          ' v??o ng??y h???c ' +
          date +
          ' ???? ???????c ch???p thu???n',
      };
      this.api.createNotiForPerson(request).subscribe((response) => {
        console.log('K???t qu??? g???i noti cho gi??o vi??n sau reopen: ' + response);
      });
    }
  }

  // alert
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  doYes(): void {
    this.haveAlertYN = false;
    if (
      this.alertMessage === 'B???n ???? ki???m tra th??ng tin kh??ch h??ng k?? r???i ch??? ?'
    ) {
    }
  }

  doNo(): void {
    this.haveAlertYN = false;
  }

  doOk(): void {
    this.haveAlertOk = false;
  }

  callAlert(type: string, message: string, param?: any) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
    }
  }
}
