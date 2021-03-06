import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginResponse } from 'src/interfaces/Account';
import { ClassRequest, ClassResponse } from 'src/interfaces/Class';
import { Shift, ShiftArray } from 'src/interfaces/Shift';
import { Subject, SubjectArray } from 'src/interfaces/Subject';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';
import { ValidationService } from 'src/service/validation.service';

@Component({
  selector: 'app-class-create',
  templateUrl: './class-create.component.html',
  styleUrls: ['./class-create.component.scss'],
})
export class ClassCreateComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ClassCreateComponent>,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private localStorage: LocalStorageService,
    private validationService: ValidationService
  ) {}

  // for alert, loading
  isLoading: boolean = false;
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  //price
  price?: number;

  //form
  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    openingDate: ['', Validators.required],
    subjectId: ['', Validators.required],
    shiftId: ['', Validators.required],
    status: ['Chờ mở lớp', Validators.required],
  });

  //for logic
  openingDate?: string;
  isSuccess: boolean = false;
  subjectList?: Array<Subject>;
  shiftList?: Array<Shift>;

  ngOnInit(): void {
    this.isLoading = true;
    this.api.getSubjectByName('', true, 1, 1000).subscribe(
      (response: SubjectArray) => {
        this.subjectList = response.subjectsResponseDto;
        this.api.getAllShift(1, 100, true).subscribe(
          (response: ShiftArray) => {
            this.shiftList = response.shiftDtos;
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            this.callAlert('Ok', 'Có lỗi xảy ra, vui lòng thử lại', 'close');
          }
        );
      },
      (error) => {
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra, vui lòng thử lại', 'close');
      }
    );
  }

  onChangeSubject(subjectId: string) {
    let id: number = +subjectId;
    let subject = this.subjectList?.find((x) => x.subjectId === id);
    this.price = subject?.price;
  }

  create(): void {
    // 02/12/2021 QuangHN Add validate START
    let className = this.form.controls.name.value;
    let shiftId = this.form.controls.shiftId.value;
    let subjectId = this.form.controls.subjectId.value;
    let openingDate = this.form.controls.openingDate.value;

    // check null
    if (this.validationService.isNull(className, 'Tên lớp học')) {
      return;
    }
    if (this.validationService.isNull(shiftId, 'Ca học')) {
      return;
    }
    if (this.validationService.isNull(subjectId, 'Môn học')) {
      return;
    }
    if (this.validationService.isNull(openingDate, 'Ngày khai giảng')) {
      return;
    }

    // check invalid
    if (this.validationService.isInvalidInput(className, 'Tên lớp học')) {
      return;
    }
    // 02/12/2021 QuangHN Add validate END

    let user: LoginResponse = this.localStorage.get('user');
    const request: ClassRequest = {
      className: this.form.controls.name.value,
      shiftId: +this.form.controls.shiftId.value,
      subjectId: +this.form.controls.subjectId.value,
      branchId: this.data.branchId,
      openingDate: this.form.controls.openingDate.value,
      creator: user.username,
    };
    this.isLoading = true;
    this.api.createClass(request).subscribe(
      (response: ClassResponse) => {
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
        if (error.error === 'Class Name is null or empty!') {
          this.callAlert('Ok', 'Tên lớp không được để trống');
        } else if (
          error.error === 'Class Opening Date is null or in the past!'
        ) {
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
