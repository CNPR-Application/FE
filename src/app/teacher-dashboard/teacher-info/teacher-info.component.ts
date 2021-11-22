import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from 'src/app/manager-dashboard/manager-info/change-password/change-password.component';
import { LoginResponse } from 'src/interfaces/Account';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';
import { TeacherAvatarComponent } from './teacher-avatar/teacher-avatar.component';

@Component({
  selector: 'app-teacher-info',
  templateUrl: './teacher-info.component.html',
  styleUrls: ['./teacher-info.component.scss'],
})
export class TeacherInfoComponent implements OnInit {
  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog
  ) {}

  // for alert, loading
  isLoading: boolean = true;
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  //model
  info?: LoginResponse;
  today = new Date();
  //form
  form = this.formBuilder.group({
    username: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    birthday: ['', Validators.required],
    role: ['', Validators.required],
    branchId: [],
    branchName: [],
    creatingDate: [],
    image: [''],
    experience: [''],
  });
  //for form
  creatingDate?: string;
  birthday?: string;
  role?: string;
  isHavingParent?: boolean;
  path?: String;
  url?: string;
  isUpload: boolean = false;

  ratingArr: Array<number> = [];
  rating: number = 3;

  ngOnInit(): void {
    this.info = this.localStorageService.get('user');
    this.setValue();
    if (this.info?.rating) {
      this.rating = this.getRating(this.info?.rating);
    }
    this.ratingArr = [];
    for (let i = 0; i < 5; i++) {
      this.ratingArr.push(i);
    }
  }

  getRating(ratingString: string): number {
    let temp = ratingString.split('/');
    let n1: number = +temp[0];
    let n2: number = +temp[1];
    return n1 / n2;
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return '#ffd740';
    } else {
      return 'rgba(216, 216, 216, 0.41)';
    }
  }

  setValue(): void {
    this.form.controls.username.setValue(this.info?.username);
    this.form.controls.name.setValue(this.info?.name);
    this.form.controls.email.setValue(this.info?.email);
    this.form.controls.phone.setValue(this.info?.phone);
    this.form.controls.address.setValue(this.info?.address);
    this.form.controls.birthday.setValue(this.info?.birthday);
    this.birthday = this.info?.birthday;
    this.form.controls.branchName.setValue(this.info?.branchName);
    this.form.controls.branchId.setValue(this.info?.branchId);
    this.form.controls.creatingDate.setValue(this.info?.creatingDate);
    this.form.controls.role.setValue(this.info?.role);
    this.form.controls.image.setValue(this.info?.image);
    this.form.controls.experience.setValue(this.info?.experience);
    this.url = this.info?.image;
    this.creatingDate = this.info?.creatingDate;
    this.role = this.info?.role;
    this.isLoading = false;
  }

  openAvatarDialog(): void {
    let dialogRef = this.dialog.open(TeacherAvatarComponent, {
      data: this.info?.username,
    });
    dialogRef.afterClosed().subscribe((data: string) => {
      if (data) {
        this.url = data;
        if (this.info) {
          let request: LoginResponse = this.info;
          request.image = this.url;
          this.localStorageService.set('user', request);
          window.location.reload();
        }
      }
    });
  }

  editInfo(): void {
    this.isLoading = true;
    const request: LoginResponse = {
      username: this.form.controls.username.value,
      name: this.form.controls.name.value,
      email: this.form.controls.email.value,
      phone: this.form.controls.phone.value,
      rating: this.info?.rating,
      experience: this.form.controls.experience.value,
      role: this.info?.role,
      address: this.form.controls.address.value,
      branchId: this.info?.branchId,
      branchName: this.info?.branchName,
      creatingDate: this.info?.creatingDate,
      birthday: this.birthday,
      image: this.url,
    };
    this.api.editInfo(request).subscribe(
      (response: boolean) => {
        this.isLoading = false;
        if (response) {
          this.callAlert('Ok', 'Chỉnh sửa thành công');
          this.localStorageService.set('user', request);
          this.ngOnInit();
        } else {
          this.callAlert('Ok', 'Tên chương trình đã tồn tại. Vui lòng thử lại');
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi chỉnh sửa, vui lòng thử lại');
      }
    );
  }

  openChangePass(){
    let dialogRef = this.dialog.open(ChangePasswordComponent);
    dialogRef.afterClosed().subscribe();
  }

  callAlert(type: string, message: string) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
    }
  }
}
