import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GetByRoleResponse, LoginResponse } from 'src/interfaces/Account';
import { AttendanceList } from 'src/interfaces/Attendance';
import { ClassArray, ClassResponse } from 'src/interfaces/Class';
import { NotiPersonRequest } from 'src/interfaces/Notification';
import { SessionList, SessionResponse } from 'src/interfaces/Session';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';
import {
  AttendanceChecking,
  AttendanceEditClass,
  SessionStatus,
} from './attendance';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
  constructor(
    private localStorage: LocalStorageService,
    private api: ApiService
  ) {}

  today: Date = new Date();
  teacherUsername?: string;
  name?: string;
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
  attendanceArray?: Array<AttendanceChecking>;
  pageArray?: Array<number>;
  currentPage?: number = 1;

  //midpoint
  midpoint: number = 0;
  endpoint: number = 0;

  // edit attendance
  statusAttendanceArray?: Array<AttendanceEditClass>;
  statusSession?: Array<SessionStatus>;

  //reopen
  isReopen: boolean = false;
  closingDate?: string;
  managerUsername?: string;
  branchId?: number;

  ngOnInit(): void {
    let user: LoginResponse = this.localStorage.get('user');
    this.teacherUsername = user.username;
    this.name = user.name;
    this.getClass();
  }

  getClass(): void {
    this.isLoadingClass = true;
    if (this.teacherUsername && this.currentPage) {
      this.api
        .searchClassByTeacherUsernameAndStatus(
          this.teacherUsername,
          this.status,
          this.currentPage,
          20
        )
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
              this.branchId = this.classArray[0].branchId;
              this.getSession(this.classId, this.branchId);
            }
          },
          (error) => {
            console.log(error);
            this.isLoadingClass = false;
            this.callAlert(
              'Ok',
              'Có lỗi xảy ra khi tải lớp học, vui lòng thử lại'
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

  getSession(classId?: number, branchId?: number): void {
    this.isLoadingSession = true;
    this.classId = classId;
    this.attendanceArray = undefined;
    this.statusAttendanceArray = undefined;
    if (classId && branchId) {
      this.api.getSessionInClass(classId, 1, 1000).subscribe(
        (response: SessionList) => {
          this.sessionArray = response.sessionList;
          this.statusSession = [];
          if (this.sessionArray) {
            for (let i = 0; i < this.sessionArray?.length; i++) {
              let s = new SessionStatus(this.sessionArray[i]);
              this.statusSession.push(s);
              if (s.status === 'Đang mở') {
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
            'Có lỗi xảy ra khi tải các buổi học, vui lòng thử lại'
          );
        }
      );
      this.getManager(branchId);
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
            let y = new AttendanceChecking(x);
            this.attendanceArray?.push(y);
            if (x.isReopen) {
              this.isReopen = true;
              this.closingDate = x.closingDate;
              this.sessionStatus = 'Đang mở';
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
              let y = new AttendanceEditClass(
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
            'Có lỗi xảy ra khi tải điểm danh, vui lòng thử lại'
          );
        }
      );
    }
  }

  reopen() {
    this.isLoadingAttendance = true;
    let date;
    if (this.selectedSession?.startTime) {
      date = formatDate(this.selectedSession?.startTime, 'dd-MM-yyyy', 'en-US');
    }
    if (this.name && this.teacherUsername && this.managerUsername) {
      let request: NotiPersonRequest = {
        receiverUsername: this.managerUsername,
        senderUsername: this.teacherUsername,
        title: 'Yêu cầu mở lại điểm danh từ giáo viên ' + this.name,
        body:
          'Yêu cầu mở lại điểm danh từ giáo viên ' +
          this.name +
          ' đối với lớp ' +
          this.selectedClass?.className +
          ' vào ngày học ' +
          date,
      };
      this.api.createNotiForPerson(request).subscribe(
        (response) => {
          if (response) {
            this.callAlert('Ok', 'Yêu cầu mở lại điểm danh thành công!');
            this.isLoadingAttendance = false;
          } else {
            this.callAlert(
              'Ok',
              'Có lỗi xảy ra khi yêu cầu mở lại điểm danh, vui lòng thử lại !'
            );
          }
        },
        (error) => {
          console.log(error);
          this.callAlert(
            'Ok',
            'Có lỗi xảy ra khi yêu cầu mở lại điểm danh, vui lòng thử lại !'
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

  editAttendance() {
    this.isLoadingAttendance = true;
    if (this.statusAttendanceArray) {
      this.api.editAttendance(this.statusAttendanceArray).subscribe(
        (response) => {
          if (response) {
            this.callAlert('Ok', 'Điểm danh thành công');
            this.isLoadingAttendance = false;
            this.getAttendance(this.selectedSession?.sessionId);
          } else {
            this.isLoadingAttendance = false;
            this.callAlert(
              'Ok',
              'Có lỗi xảy ra khi lưu điểm danh, vui lòng thử lại'
            );
          }
        },
        (error) => {
          this.isLoadingAttendance = false;
          console.log(error);
          this.callAlert(
            'Ok',
            'Có lỗi xảy ra khi lưu điểm danh, vui lòng thử lại'
          );
        }
      );
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

  getManager(branchId: number) {
    this.api
      .searchInfoByRoleBranchIsAvail('manager', branchId, true)
      .subscribe((response) => {
        let temp = response.accountList;
        this.managerUsername = temp[0].username;
      });
  }

  // alert
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  doYes(): void {
    this.haveAlertYN = false;
    if (
      this.alertMessage === 'Bạn đã kiểm tra thông tin khách hàng kĩ rồi chứ ?'
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
