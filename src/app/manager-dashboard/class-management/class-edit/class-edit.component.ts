import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookingArray } from 'src/interfaces/Booking';
import { ClassEditRequest, ClassResponse } from 'src/interfaces/Class';
import { NotiGroupRequest } from 'src/interfaces/Notification';
import { ApiService } from 'src/service/api.service';
import { ValidationService } from 'src/service/validation.service';
import { ClassCreateComponent } from '../class-create/class-create.component';

@Component({
  selector: 'app-class-edit',
  templateUrl: './class-edit.component.html',
  styleUrls: ['./class-edit.component.scss'],
})
export class ClassEditComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ClassCreateComponent>,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService
  ) {}

  // for alert, loading
  isLoading: boolean = false;
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  title: string = 'Chỉnh sửa';

  //form
  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    openingDate: ['', Validators.required],
    roomId: [0],
    status: ['waiting'],
    shift: [''],
  });

  //for logic
  openingDate?: string;
  oldOpeningDate?: string;
  isSuccess: boolean = false;

  classModel?: ClassResponse;
  username: string[] = [];

  ngOnInit(): void {
    this.classModel = this.data.class;
    this.getBookingList();
    this.form.controls.name.setValue(this.classModel?.className);
    this.form.controls.openingDate.setValue(this.classModel?.openingDate);
    this.form.controls.shift.setValue(this.classModel?.shiftDescription);
    this.openingDate = this.classModel?.openingDate;
    this.oldOpeningDate = this.classModel?.openingDate;
  }

  changeTitle() {
    this.title = 'Dời khai giảng';
  }

  getBookingList(): void {
    this.isLoading = true;
    if (this.classModel && this.classModel.classId) {
      this.api
        .searchBookingByClassIdAndStatus(
          this.classModel.classId,
          'paid',
          1,
          1000
        )
        .subscribe(
          (data: BookingArray) => {
            data.classList?.forEach((x) => {
              if (x.studentUsername) {
                this.username.push(x.studentUsername);
              }
            });
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            this.callAlert(
              'Ok',
              'Có lỗi xảy ra khi tải học sinh đăng ký, vui lòng thử lại'
            );
          }
        );
    }
  }

  edit() {
    // 1/12/2021 QuangHN Add Validate START
    let name = this.form.controls.name.value;
    let openingDate = this.form.controls.openingDate.value;

    //check null
    if (this.validationService.isNull(name, 'Tên lớp học')) {
      return;
    }
    if (this.validationService.isNull(openingDate, 'Ngày khai giảng')) {
      return;
    }

    //check invalid
    if (this.validationService.isInvalidInput(name, 'Tên lớp học')) {
      return;
    }
    // 1/12/2021 QuangHN Add Validate END

    if (this.classModel && this.classModel.classId) {
      this.isLoading = true;
      let request: ClassEditRequest = {
        className: this.form.controls.name.value,
        openingDate: this.form.controls.openingDate.value,
        roomId: 0,
        status: 'waiting',
      };
      this.api.editClass(this.classModel.classId, request).subscribe(
        (response) => {
          if (response) {
            this.isSuccess = true;
            if (this.title == 'Dời khai giảng') {
              this.sendEmail();
            } else {
              this.isLoading = false;
              this.callAlert('Ok', 'Chỉnh sửa thành công');
            }
          } else {
            this.isLoading = false;
            this.callAlert('Ok', 'Có lỗi xảy ra vui lòng thử lại');
          }
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.isSuccess = false;
          console.log(error);
          if (error.error === 'Class Name is null or empty!') {
            this.callAlert('Ok', 'Tên lớp không được để trống');
          } else if (error.error === 'Null or invalid opening day!') {
            this.callAlert('Ok', 'Ngày khai giảng không hợp lệ');
          } else if (error.error == 'Opening Day must be a day in Shift!') {
            this.callAlert(
              'Ok',
              'Ngày khai giảng bạn chọn không khớp với ca học'
            );
          } else {
            this.callAlert('Ok', 'Có lỗi xảy ra vui lòng thử lại');
          }
        }
      );
    }
  }

  sendEmail() {
    if (this.oldOpeningDate && this.classModel && this.classModel.className) {
      let oldDate = formatDate(this.oldOpeningDate, 'dd-MM-yyyy', 'en-US');
      let newDate = formatDate(
        this.form.controls.openingDate.value,
        'dd-MM-yyyy',
        'en-US'
      );
      let request: NotiGroupRequest = {
        username: this.username,
        senderUsername: 'system',
        title: 'Thông báo dời khai giảng lớp học ' + this.classModel?.className,
        body:
          'Trung tâm CNPR chúng tôi rất xin lỗi quý khách hàng vì phải dời ngày khai giảng của lớp ' +
          this.classModel?.className +
          ' từ ngày ' +
          oldDate +
          ' sang ngày ' +
          newDate +
          ' vì lý do vẫn chưa đủ số lượng học sinh để khai giảng. Chi tiết và mọi thắc mắc, nhân viên tư vấn chúng tôi sẽ liên hệ quý khách hàng trong thời gian sớm nhất ! Mong quý khách hàng thông cảm, chúng tôi chân thành cám ơn !',
        className: this.classModel?.className,
        oldOpeningDate: oldDate,
        newOpeningDate: newDate,
      };
      this.api.createNotiForGroup(request).subscribe(
        (response) => {
          if (response) {
            this.isLoading = false;
            this.callAlert(
              'Ok',
              'Chỉnh sửa và gửi email thông báo dời khai giảng thành công'
            );
          } else {
            this.isLoading = false;
            this.callAlert('Ok', 'Có lỗi xảy ra vui lòng thử lại');
          }
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
          this.callAlert('Ok', 'Có lỗi xảy ra vui lòng thử lại');
        }
      );
    }
  }

  close(): void {
    this.haveAlertOk = false;
    if (this.isSuccess) {
      this.dialogRef.close(this.isSuccess);
    }
  }

  callAlert(type: string, message: string, param?: string) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
    }
    if (param === 'close') {
      this.dialogRef.close();
    }
  }
}
