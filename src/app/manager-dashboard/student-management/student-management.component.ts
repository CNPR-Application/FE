import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginResponse } from 'src/interfaces/Account';
import { StudentResponse } from 'src/interfaces/Student';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';
import { CreateAccountComponent } from './create-account/create-account.component';

@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.scss'],
})
export class StudentManagementComponent implements OnInit {
  constructor(
    private localStorage: LocalStorageService,
    private dialog: MatDialog,
    private router: Router,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) {}

  today = new Date();
  form = this.formBuilder.group({
    username: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    birthday: ['', Validators.required],
    role: ['student', Validators.required],
    branchId: [],
    parentPhone: [],
    parentName: [],
    image: [''],
  });

  isAvailable: boolean = true;
  currentPage: number = 1;
  pageArray?: Array<number>;
  isLoadingStudent: boolean = true;
  branchId?: number;
  studentArray?: Array<StudentResponse>;
  clickedId?: number;
  clickedImage?: string;
  clickedStudent?: StudentResponse;
  birthday?: string;

  //search
  keyNameGuest: string = '';
  keyPhoneGuest: string = '';

  ngOnInit(): void {
    let user: LoginResponse = this.localStorage.get('user');
    this.branchId = user.branchId;
    this.getStudentList();
  }

  getStudentList() {
    if (this.branchId) {
      this.isLoadingStudent = true;
      this.api
        .getStudentInBranch(
          this.branchId,
          this.isAvailable,
          this.currentPage,
          15
        )
        .subscribe(
          (response) => {
            this.studentArray = response.studentResponseDtos;
            this.currentPage = response.pageNo;
            this.pageArray = Array(response.totalPage)
              .fill(1)
              .map((x, i) => i + 1)
              .reverse();
            this.isLoadingStudent = false;
          },
          (error) => {
            console.error(error);
            this.isLoadingStudent = false;
            this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
          }
        );
    }
  }

  searchGuest() {
    if (this.keyNameGuest === '' && this.keyPhoneGuest === '') {
      this.getStudentList();
    } else {
      if (this.branchId) {
        this.isLoadingStudent = true;
        this.api
          .searchStudentByBranchNamePhone(
            this.branchId,
            this.isAvailable,
            this.keyPhoneGuest,
            this.keyNameGuest,
            this.currentPage,
            15
          )
          .subscribe(
            (response) => {
              this.studentArray = response.studentList;
              this.currentPage = response.pageNo;
              this.pageArray = Array(response.totalPage)
                .fill(1)
                .map((x, i) => i + 1)
                .reverse();
              this.isLoadingStudent = false;
            },
            (error) => {
              console.error(error);
              this.isLoadingStudent = false;
              this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
            }
          );
      }
    }
  }

  changePage(pageNo: number) {
    this.currentPage = pageNo;
    this.resetForm();
    this.searchGuest();
  }

  changeStatus(isAvailable: boolean) {
    if (this.isAvailable != isAvailable) {
      this.currentPage = 1;
      this.isAvailable = isAvailable;
      this.resetForm();
      this.searchGuest();
    }
  }

  setForm(student: StudentResponse) {
    this.clickedId = student.studentId;
    this.birthday = student.birthday;
    this.clickedStudent = student;
    this.form.controls.name.setValue(student.name);
    this.form.controls.username.setValue(student.username);
    this.form.controls.email.setValue(student.email);
    this.form.controls.phone.setValue(student.phone);
    this.form.controls.birthday.setValue(student.birthday);
    this.form.controls.address.setValue(student.address);
    this.form.controls.parentName.setValue(student.parentName);
    this.form.controls.parentPhone.setValue(student.parentPhone);
    this.clickedImage = student.image;
  }

  resetForm() {
    this.clickedImage = undefined;
    this.clickedId = undefined;
    this.birthday = undefined;
    this.clickedStudent = undefined;
    this.form.reset();
  }

  deleteStudent(username: string) {
    this.isLoadingStudent = true;
    this.api.deleteStudent(username).subscribe(
      (response: boolean) => {
        this.isLoadingStudent = false;
        if (response) {
          this.callAlert('Ok', 'Xóa thành công');
          this.resetForm();
          this.searchGuest();
        } else {
          this.callAlert('Ok', 'Có lỗi xảy ra khi xóa, vui lòng thử lại');
        }
      },
      (error: HttpErrorResponse) => {
        this.isLoadingStudent = false;
        if (
          error.error ===
          "CAN NOT DELETE STUDENT BECAUSE STUDENT'S CLASS IS WAITING/STUDYING!"
        ) {
          this.callAlert(
            'Ok',
            'Học sinh này không thể xóa vì hiện đang có lớp học'
          );
        } else if (error.error === 'Username not exist!') {
          this.callAlert('Ok', 'Học sinh này không thể xóa vì không tồn tại');
        } else if (
          error.error ===
          "CAN NOT DELETE STUDENT BECAUSE STUDENT'S BOOKING IS PAID!"
        ) {
          this.callAlert(
            'Ok',
            'Học sinh này không thể xóa vì hiện đang có đơn đăng ký chưa xử lý'
          );
        } else {
          this.callAlert('Ok', 'Có lỗi xảy ra khi xóa, vui lòng thử lại');
        }
      }
    );
  }

  recoverStudent(username: string) {
    const request: LoginResponse = {
      username: username,
      birthday: this.birthday,
      isAvailable: true,
    };
    this.isLoadingStudent = true;
    this.api.editInfo(request).subscribe(
      (response) => {
        this.isLoadingStudent = false;
        this.callAlert('Ok', 'Khôi phục thành công');
        this.resetForm();
        this.searchGuest();
      },
      (error) => {
        this.isLoadingStudent = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi khôi phục, vui lòng thử lại');
        console.log(error);
      }
    );
  }

  goToDetailPage(student: StudentResponse) {
    this.localStorage.set('data', student);
    this.localStorage.set('message', 'viewStudentClass');
    this.router.navigate(['manager-dashboard/student-class']);
  }

  goToDetailBookingPage(student: StudentResponse) {
    this.localStorage.set('data', student);
    this.localStorage.set('message', 'viewStudentBooking');
    this.router.navigate(['manager-dashboard/student-bookings']);
  }

  openCreateAccount(type: string) {
    let dialogRef = this.dialog.open(CreateAccountComponent, {
      data: {
        type: type,
        param: this.clickedStudent,
      },
    });
    dialogRef.afterClosed().subscribe((data: string) => {
      if (data) {
        this.searchGuest();
        this.resetForm();
      }
    });
  }

  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  username: string = '';

  doYes(): void {
    this.haveAlertYN = false;
    if (this.alertMessage === 'Bạn có chắc chắn muốn xóa học sinh này không?') {
      this.deleteStudent(this.username);
    } else if (
      this.alertMessage ===
      'Bạn có chắc chắn muốn khôi phục học sinh này không?'
    ) {
      this.recoverStudent(this.username);
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
      this.username = param;
    }
  }
}
