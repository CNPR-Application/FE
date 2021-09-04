import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Booking } from 'src/app/models/Booking';
import { ClassArray, ClassResponse } from 'src/app/models/Class';
import { Subject, SubjectArray } from 'src/app/models/Subject';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-booking-create',
  templateUrl: './booking-create.component.html',
  styleUrls: ['./booking-create.component.scss'],
})
export class BookingCreateComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BookingCreateComponent>,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) {}

  name?: string;
  username?: string;
  branchId?: number;
  subjectId?: number;
  classId?: number;
  shiftId?: number;
  price?: number;

  subjectList?: Array<Subject>;
  classList?: Array<ClassResponse>;
  // for alert, loading
  isLoading: boolean = false;
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  isSuccess: boolean = false;
  isLoadingSubject: boolean = false;
  //form
  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    subjectId: ['', Validators.required],
    classId: ['', Validators.required],
    description: ['', Validators.required],
  });

  ngOnInit(): void {
    this.name = this.data.name;
    this.username = this.data.username;
    this.branchId = this.data.branchId;
    this.isLoadingSubject = true;
    this.getListClass();
  }

  getListSubject(): void {
    this.api.getSubjectByName('', true, 1, 1000).subscribe(
      (response: SubjectArray) => {
        this.subjectList = response.subjectsResponseDtos;
        this.isLoadingSubject = false;
      },
      (error) => {
        this.isLoadingSubject = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi tải môn học, vui lòng thử lại');
      }
    );
  }

  getListClass(): void {
    if (this.branchId)
      this.api.getClassByBranch(this.branchId, 'waiting', 1, 1000).subscribe(
        (response: ClassArray) => {
          this.classList = response.classList;
          this.isLoadingSubject = false;
        },
        (error) => {
          this.isLoadingSubject = false;
          this.callAlert('Ok', 'Có lỗi xảy ra khi tải lớp, vui lòng thử lại');
        }
      );
  }

  changeClass(classId: string): void {
    this.classId = +classId;
    let classA = this.classList?.find((x) => x.classId === this.classId);
    this.shiftId = classA?.shiftId;
    this.price = classA?.subjectPrice;
  }

  bookClass(): void {
    const request: Booking = {
      payingPrice: this.price,
      description: this.form.controls.description.value,
      status: 'paid',
      studentUsername: this.username,
      branchId: this.branchId,
      classId: this.classId,
    };
    this.isLoading = true;
    this.api.createBooking(request).subscribe(
      (response: boolean) => {
        if (response) {
          this.isSuccess = true;
          this.isLoading = false;
          this.callAlert('Ok', 'Tạo mới thành công');
        }
      },
      (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.isSuccess = false;
        console.log(error);
        if (error.error === 'Class ID not exist!') {
          this.callAlert('Ok', 'Lớp không tồn tại');
        } else {
          this.callAlert('Ok', 'Có lỗi xảy ra vui lòng thử lại');
        }
      }
    );
  }

  onChangeSubject(subjectId: string) {
    this.subjectId = +subjectId;
    let subject = this.subjectList?.find((x) => x.subjectId === this.subjectId);
    this.price = subject?.price;
    this.isLoading = true;
    if (this.branchId && subjectId) {
      this.api
        .searchClassBySubjectAndShift(
          this.branchId,
          this.subjectId,
          0,
          'waiting',
          1,
          1000
        )
        .subscribe(
          (response: ClassArray) => {
            if (response.classList && response.classList.length > 0) {
              this.classList = response.classList;
              this.isLoading = false;
            } else {
              this.isLoading = false;
              this.callAlert(
                'Ok',
                'Môn học này không có lớp học.Vui lòng chọn môn khác'
              );
            }
          },
          (error) => {
            this.isLoading = false;
            this.callAlert(
              'Ok',
              'Có lỗi xảy ra khi tải lớp học, vui lòng thử lại'
            );
          }
        );
    }
  }

  doOk(): void {
    this.haveAlertOk = false;
    if (
      this.alertMessage === 'Có lỗi xảy ra khi tải môn học, vui lòng thử lại'
    ) {
      this.getListSubject();
    }
  }

  close(): void {
    this.haveAlertOk = false;
    if (this.isSuccess) {
      this.dialogRef.close(this.data.guestId);
    }
  }

  callAlert(type: string, message: string) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
    }
  }
  doYes(): void {
    this.haveAlertYN = false;
  }

  doNo(): void {
    this.haveAlertYN = false;
  }
}
