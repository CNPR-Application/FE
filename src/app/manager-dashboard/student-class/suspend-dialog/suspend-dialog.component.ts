import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClassResponse, ClassSuspendRequest } from 'src/interfaces/Class';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-suspend-dialog',
  templateUrl: './suspend-dialog.component.html',
  styleUrls: ['./suspend-dialog.component.scss'],
})
export class SuspendDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SuspendDialogComponent>,
    private api: ApiService
  ) {}

  type?: string;
  branchId?: number;
  studentInClassId?: number;
  price?: number;
  studentUsername?: string;
  openingDate?: string;

  // classArray
  classArray?: Array<ClassResponse>;
  clickedClass?: ClassResponse;

  // for alert, loading
  isLoading: boolean = false;
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  isSuccess: boolean = false;

  ngOnInit(): void {
    this.type = this.data.type;
    this.branchId = this.data.branchId;
    this.price = this.data.price;
    this.studentInClassId = this.data.studentInClassId;
    this.studentUsername = this.data.studentUsername;
    this.openingDate = formatDate(this.data.openingDate, 'yyyy-MM-dd', 'en-US');
    this.getClass();
  }

  getClass() {
    this.isLoading = true;
    if (this.type && this.price && this.branchId) {
      this.api
        .searchClassToSuspend(this.type, this.price, this.branchId)
        .subscribe((response) => {
          this.isLoading = false;
          this.classArray = [];
          if (this.type == 'studying') {
            response.forEach((x) => {
              if (
                x.numberOfStudent &&
                x.numberOfStudent <= 11 &&
                x.classId != this.data.classId
              ) {
                this.classArray?.push(x);
              }
            });
          } else {
            this.classArray = response;
          }
          if (this.classArray.length == 0) {
            this.isSuccess = true;
            this.callAlert('Ok', 'Không có lớp học phù hợp bạn tìm kiếm');
          }
        }),
        (error: HttpErrorResponse) => {
          console.log(error);
          this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
          this.isLoading = false;
        };
    }
  }

  suspendClass(clickedClass: ClassResponse) {
    if (
      this.openingDate &&
      clickedClass &&
      clickedClass.classId &&
      this.studentUsername &&
      this.studentInClassId
    ) {
      this.isLoading = true;
      let status = 'class';
      if (this.type == 'waiting') {
        status = 'booking';
      }
      let request: ClassSuspendRequest = {
        openingDate: this.openingDate,
        type: status,
        newClassId: clickedClass.classId,
        studentUsername: this.studentUsername,
        description:
          'Học sinh ' +
          this.studentUsername +
          ' chuyển tới lớp ' +
          clickedClass.className,
        branchId: this.branchId,
        subjectId: clickedClass.subjectId,
      };
      console.log(request);
      this.api.suspendClass(this.studentInClassId, request).subscribe(
        (response) => {
          this.isLoading = false;
          if (response) {
            this.isSuccess = true;
            this.callAlert('Ok', 'Chuyển lớp thành công');
          } else {
            this.callAlert(
              'Ok',
              'Có lỗi xảy ra khi chuyển lớp, vui lòng thử lại'
            );
          }
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          console.log(error);
          if (error.error == 'Class suspension request denied!') {
            this.callAlert(
              'Ok',
              'Không thể chuyển lớp do đã quá ngày có thể chuyển lớp!'
            );
          } else {
            this.callAlert(
              'Ok',
              'Có lỗi xảy ra khi chuyển lớp, vui lòng thử lại'
            );
          }
        }
      );
    }
  }

  doYes(): void {
    this.haveAlertYN = false;
    if (this.clickedClass) {
      this.suspendClass(this.clickedClass);
    }
  }

  doNo(): void {
    this.haveAlertYN = false;
  }

  close(): void {
    this.haveAlertOk = false;
    if (this.isSuccess) {
      this.dialogRef.close(this.isSuccess);
    }
  }

  callAlert(type: string, message: string, param?: ClassResponse) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
    }
    if (param) {
      this.clickedClass = param;
    }
  }
}
