import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClassArray, ClassResponse } from 'src/interfaces/Class';
import { StudentResponse } from 'src/interfaces/Student';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';
import { SuspendDialogComponent } from './suspend-dialog/suspend-dialog.component';

@Component({
  selector: 'app-student-class',
  templateUrl: './student-class.component.html',
  styleUrls: ['./student-class.component.scss'],
})
export class StudentClassComponent implements OnInit {
  constructor(
    private localStorage: LocalStorageService,
    private api: ApiService,
    private dialog: MatDialog
  ) {}

  today?: Date;
  listTitle: string = 'Danh sách lớp chờ khai giảng';
  isLoading: boolean = true;
  classArray?: Array<ClassResponse>;
  //paging
  totalPage?: number;
  currentPage?: number;
  pageArray?: Array<number>;
  //clickId
  clickedId: number = 0;
  //for search
  status: string = 'waiting';
  //
  student?: StudentResponse;
  url?: string;
  username?: string;
  openingDate?: string;
  // clicked class
  clickedClass?: ClassResponse;
  //suspend
  suspendSubject?: number[];

  ngOnInit(): void {
    this.today = new Date();
    let message = this.localStorage.get('message');
    if (message === 'viewStudentClass') {
      this.student = this.localStorage.get('data');
      this.url = this.student?.image;
      this.username = this.student?.username;
      this.getSuspendClass();
      if (this.username) this.getClassAll(this.username, this.status, 1);
    }
  }

  isSubjectSuspended(id?: number) {
    if (id) {
      return this.suspendSubject?.includes(id);
    }
    return true;
  }

  changeTitle(name: string): void {
    this.listTitle = name;
    if (name === 'Danh sách lớp chờ khai giảng') {
      this.status = 'waiting';
    } else if (name === 'Danh sách lớp đang học') {
      this.status = 'studying';
    } else if (name === 'Danh sách lớp đã kết thúc') {
      this.status = 'finished';
    } else if (name === 'Danh sách lớp đã hủy') {
      this.status = 'canceled';
    }
    if (this.username) this.getClassAll(this.username, this.status, 1);
  }

  getClassAll(username: string, status: string, pageNo: number): void {
    this.isLoading = true;
    this.api
      .searchClassByStudentUsernameAndStatus(username, status, pageNo, 13)
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

  getSuspendClass() {
    if (this.username)
      this.api.searchSuspendedClassOfStudent(this.username).subscribe(
        (response: ClassResponse[]) => {
          this.suspendSubject = [];
          response.forEach((x) => {
            if (
              x.subjectId &&
              !this.suspendSubject?.includes(x.subjectId) &&
              x.suspend
            ) {
              this.suspendSubject?.push(x.subjectId);
            }
          });
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
        }
      );
  }

  changePage(pageNo: number) {
    if (this.username) this.getClassAll(this.username, this.status, pageNo);
  }

  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  doYes(type: string): void {
    this.haveAlertYN = false;
    let dialogRef = this.dialog.open(SuspendDialogComponent, {
      data: {
        type: type,
        studentUsername: this.username,
        price: this.clickedClass?.subjectPrice,
        branchId: this.clickedClass?.branchId,
        openingDate: this.clickedClass?.openingDate,
        studentInClassId: this.clickedClass?.studentInClassId,
        classId: this.clickedClass?.classId,
      },
    });
    dialogRef.afterClosed().subscribe((data: string) => {
      if (data) {
        this.changeTitle('studying');
      }
    });
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
    this.clickedClass = param;
  }
}
