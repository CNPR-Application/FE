import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginResponse } from 'src/interfaces/Account';
import { TeacherInfo } from 'src/interfaces/Teacher';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';
import { TeachingSubjectComponent } from './teaching-subject/teaching-subject.component';

@Component({
  selector: 'app-teacher-management',
  templateUrl: './teacher-management.component.html',
  styleUrls: ['./teacher-management.component.scss'],
})
export class TeacherManagementComponent implements OnInit {
  constructor(
    private localStorage: LocalStorageService,
    private dialog: MatDialog,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  today = new Date();
  form = this.formBuilder.group({
    username: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    birthday: ['', Validators.required],
    role: ['teacher', Validators.required],
    branchId: [],
    experience: [],
    creatingDate: [],
    rating: [],
    image: [''],
  });

  isAvailable: boolean = true;
  currentPage: number = 1;
  pageArray?: Array<number>;
  isLoadingTeacher: boolean = true;
  branchId?: number;
  teacherArray?: Array<TeacherInfo>;
  clickedId?: number;
  clickedImage?: string;
  birthday?: string;
  creatingDate?: string;

  ratingArr: Array<number> = [];
  rating?: number;

  clickedTeacher?: TeacherInfo;

  ngOnInit(): void {
    let user: LoginResponse = this.localStorage.get('user');
    this.branchId = user.branchId;
    this.getTeacherList();
  }

  getTeacherList() {
    if (this.branchId) {
      this.isLoadingTeacher = true;
      this.api
        .searchTeacherByBranchIsAvail(
          this.branchId,
          this.isAvailable,
          this.currentPage,
          15
        )
        .subscribe(
          (response) => {
            this.teacherArray = response.teacherInBranchList;
            this.currentPage = response.pageNo;
            this.pageArray = Array(response.totalPage)
              .fill(1)
              .map((x, i) => i + 1)
              .reverse();
            this.isLoadingTeacher = false;
          },
          (error) => {
            console.error(error);
            this.isLoadingTeacher = false;
            this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
          }
        );
    }
  }

  changePage(pageNo: number) {
    this.currentPage = pageNo;
    this.resetForm();
    this.getTeacherList();
  }

  showIcon(index: number) {
    if (this.rating && this.rating >= index + 1) {
      return '#ffd740';
    } else {
      return 'rgba(216, 216, 216, 0.41)';
    }
  }

  toFloat(x: number): number {
    let string = '' + x;
    string.replace(',', '.');
    return Math.floor(parseFloat(string));
  }

  changeStatus(isAvailable: boolean) {
    if (this.isAvailable != isAvailable) {
      this.currentPage = 1;
      this.isAvailable = isAvailable;
      this.resetForm();
      this.getTeacherList();
    }
  }

  setForm(teacher: TeacherInfo) {
    this.clickedId = teacher.teacherId;
    this.clickedTeacher = teacher;
    this.birthday = teacher.teacherBirthday;
    this.creatingDate = teacher.accountCreatingDate;
    this.form.controls.name.setValue(teacher.teacherName);
    this.form.controls.username.setValue(teacher.teacherUsername);
    this.form.controls.email.setValue(teacher.teacherEmail);
    this.form.controls.phone.setValue(teacher.teacherPhone);
    this.form.controls.birthday.setValue(teacher.teacherBirthday);
    this.form.controls.creatingDate.setValue(teacher.accountCreatingDate);
    this.form.controls.address.setValue(teacher.teacherAddress);
    this.form.controls.experience.setValue(teacher.teacherExperience);
    this.form.controls.rating.setValue(teacher.teacherRating);
    this.clickedImage = teacher.teacherImage;
    this.rating = this.toFloat(teacher.teacherRating);
    this.ratingArr = [];
    for (let i = 0; i < 5; i++) {
      this.ratingArr.push(i);
    }
  }

  resetForm() {
    this.clickedImage = undefined;
    this.clickedId = undefined;
    this.birthday = undefined;
    this.creatingDate = undefined;
    this.rating = undefined;
    this.clickedTeacher = undefined;
    this.form.reset();
  }

  deleteTeacher(username: string) {
    this.isLoadingTeacher = true;
    this.api.deleteTeacher(username).subscribe(
      (response: boolean) => {
        this.isLoadingTeacher = false;
        if (response) {
          this.callAlert('Ok', 'Xóa thành công');
          this.resetForm();
          this.getTeacherList();
        } else {
          this.callAlert('Ok', 'Có lỗi xảy ra khi xóa, vui lòng thử lại');
        }
      },
      (error: HttpErrorResponse) => {
        this.isLoadingTeacher = false;
        console.log(error);
        if (
          error.error ===
          "CAN NOT DELETE TEACHER BECAUSE TEACHER'S CLASS IS WAITING/STUDYING!"
        ) {
          this.callAlert(
            'Ok',
            'Giáo viên này không thể xóa vì hiện đang có lớp dạy'
          );
        } else if (error.error === 'Username not exist!') {
          this.callAlert('Ok', 'Giáo viên này không thể xóa vì không tồn tại');
        } else {
          this.callAlert('Ok', 'Có lỗi xảy ra khi xóa, vui lòng thử lại');
        }
      }
    );
  }

  recoverTeacher(username: string) {
    const request: LoginResponse = {
      username: username,
      birthday: this.birthday,
      isAvailable: true,
    };
    this.isLoadingTeacher = true;
    this.api.editInfo(request).subscribe(
      (response) => {
        this.isLoadingTeacher = false;
        this.callAlert('Ok', 'Khôi phục thành công');
        this.resetForm();
        this.getTeacherList();
      },
      (error) => {
        this.isLoadingTeacher = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi khôi phục, vui lòng thử lại');
        console.log(error);
      }
    );
  }

  openSubjectForm() {
    let dialogRef = this.dialog.open(TeachingSubjectComponent, {
      data: { teacher: this.clickedTeacher },
    });
  }

  goToDetailPage(teacher: TeacherInfo) {
    this.localStorage.set('data', teacher);
    this.localStorage.set('message', 'viewTeacherClass');
    this.router.navigate(['manager-dashboard/teacher-class']);
  }

  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  username: string = '';

  doYes(): void {
    this.haveAlertYN = false;
    if (
      this.alertMessage === 'Bạn có chắc chắn muốn xóa giáo viên này không?'
    ) {
      this.deleteTeacher(this.username);
    } else if (
      this.alertMessage ===
      'Bạn có chắc chắn muốn khôi phục giáo viên này không?'
    ) {
      this.recoverTeacher(this.username);
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
      this.username = param;
      this.haveAlertYN = true;
    }
  }
}
