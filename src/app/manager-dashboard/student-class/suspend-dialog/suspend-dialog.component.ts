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
  suspendSubject?: number[];

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
    this.suspendSubject = this.data.suspendSubject;
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
                x.classId != this.data.classId &&
                x.subjectId &&
                !this.suspendSubject?.includes(x.subjectId)
              ) {
                this.classArray?.push(x);
              }
            });
          } else {
            response.forEach((x) => {
              if (
                x.classId != this.data.classId &&
                x.subjectId &&
                !this.suspendSubject?.includes(x.subjectId)
              ) {
                this.classArray?.push(x);
              }
            });
          }
          if (this.classArray.length == 0) {
            this.isSuccess = true;
            this.callAlert('Ok', 'Kh??ng c?? l???p h???c ph?? h???p b???n t??m ki???m');
          }
        }),
        (error: HttpErrorResponse) => {
          console.log(error);
          this.callAlert('Ok', 'C?? l???i x???y ra khi t???i, vui l??ng th??? l???i');
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
          'H???c sinh ' +
          this.studentUsername +
          ' chuy???n t???i l???p ' +
          clickedClass.className,
        branchId: this.branchId,
        subjectId: clickedClass.subjectId,
      };
      this.api.suspendClass(this.studentInClassId, request).subscribe(
        (response) => {
          if (response) {
            this.isSuccess = true;
            this.callAlert('Ok', 'Chuy???n l???p th??nh c??ng');
          } else {
            this.callAlert(
              'Ok',
              'C?? l???i x???y ra khi chuy???n l???p, vui l??ng th??? l???i'
            );
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          if (error.error == 'Class suspension request denied!') {
            this.callAlert(
              'Ok',
              'Kh??ng th??? chuy???n l???p do ???? qu?? ng??y c?? th??? chuy???n l???p!'
            );
          } else {
            this.callAlert(
              'Ok',
              'C?? l???i x???y ra khi chuy???n l???p, vui l??ng th??? l???i'
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
