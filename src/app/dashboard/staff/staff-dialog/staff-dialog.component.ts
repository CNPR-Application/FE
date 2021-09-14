import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateInFoResponse, LoginResponse } from 'src/app/interfaces/Account';
import { Branch, BranchArray } from 'src/app/interfaces/Branch';
import { shiftModel } from 'src/app/interfaces/Shift';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-staff-dialog',
  templateUrl: './staff-dialog.component.html',
  styleUrls: ['./staff-dialog.component.scss'],
})
export class StaffDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<StaffDialogComponent>,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) {}
  // for alert, loading
  isLoading: boolean = false;
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  //model
  info?: LoginResponse;
  //form
  form: FormGroup = this.formBuilder.group({
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
    parentPhone: [],
    parentName: [],
    experience: [],
    rating: [],
    image: [''],
  });
  //for form
  creatingDate?: string;
  birthday?: string;
  role?: string;
  isHavingParent?: boolean;
  path?: String;
  url: string =
    'https://firebasestorage.googleapis.com/v0/b/app-test-c1bfb.appspot.com/o/ea35e7fa-19ab-4ea0-9890-5a310173d4a6.jpg?alt=media';
  isUpload: boolean = false;
  //for task
  type: string = '';
  isSuccess: boolean = false;
  //for select box
  roleList: shiftModel[] = [
    { id: 1, value: 'manager', trans: 'quản lý' },
    { id: 2, value: 'staff', trans: 'nhân viên' },
  ];
  branchList?: Array<Branch>;

  ngOnInit(): void {
    this.info = this.data.param;
    this.type = this.data.type;
    this.setValue();
  }

  getAllBranch(): void {
    this.api.getBranchByName('', 1, 1000, true).subscribe(
      (response: BranchArray) => {
        this.branchList = response.branchResponseDtos;
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
      }
    );
  }

  setValue(): void {
    this.form.controls.username.setValue(this.info?.username);
    this.form.controls.name.setValue(this.info?.name);
    this.form.controls.email.setValue(this.info?.email);
    this.form.controls.phone.setValue(this.info?.phone);
    this.form.controls.address.setValue(this.info?.address);
    this.form.controls.birthday.setValue(this.info?.birthday);
    this.birthday = this.info?.birthday;
    if (this.info?.branchResponseDtoList) {
      this.form.controls.branchName.setValue(
        this.info?.branchResponseDtoList[0].branchName
      );
      this.form.controls.branchId.setValue(
        this.info?.branchResponseDtoList[0].branchId
      );
    }
    this.form.controls.creatingDate.setValue(this.info?.creatingDate);
    this.form.controls.parentPhone.setValue(this.info?.parentPhone);
    this.form.controls.parentName.setValue(this.info?.parentName);
    this.form.controls.experience.setValue(this.info?.experience);
    this.form.controls.rating.setValue(this.info?.rating);
    this.form.controls.role.setValue(this.info?.role);
    this.form.controls.image.setValue(this.info?.image);
    if (this.info?.image) {
      this.url = this.info?.image;
    }
    this.creatingDate = this.info?.creatingDate;
    this.role = this.info?.role;
    if (this.info?.parentName || this.info?.parentPhone) {
      this.isHavingParent = true;
    } else {
      this.isHavingParent = false;
    }
    this.getAllBranch();
  }

  editInfo(): void {
    this.isLoading = true;
    this.birthday = this.form.controls.birthday.value;
    const request: LoginResponse = {
      username: this.form.controls.username.value,
      name: this.form.controls.name.value,
      email: this.form.controls.email.value,
      phone: this.form.controls.phone.value,
      address: this.form.controls.address.value,
      birthday: this.form.controls.birthday.value,
      image: this.url,
      branchId: this.form.controls.branchId.value,
      parentPhone: this.form.controls.parentPhone.value,
      parentName: this.form.controls.parentName.value,
      experience: this.form.controls.experience.value,
      role: this.form.controls.role.value,
      creatingDate: this.info?.creatingDate,
      isAvailable: true,
    };
    this.api.editInfo(request).subscribe(
      (response: boolean) => {
        if (response) {
          this.role = request.role;
          if (request.username && this.role) {
            this.changeRole(request.username, this.role);
          }
        } else {
          this.callAlert('Ok', 'Tên chương trình đã tồn tại. Vui lòng thử lại');
          this.isSuccess = false;
          this.isLoading = false;
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.isSuccess = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi chỉnh sửa, vui lòng thử lại');
      }
    );
  }

  createInfo(): void {
    this.isLoading = true;
    this.birthday = this.form.controls.birthday.value;
    const request: LoginResponse = {
      name: this.form.controls.name.value,
      email: this.form.controls.email.value,
      phone: this.form.controls.phone.value,
      address: this.form.controls.address.value,
      birthday: this.form.controls.birthday.value,
      image: this.url,
      branchId: this.form.controls.branchId.value,
      parentPhone: this.form.controls.parentPhone.value,
      parentName: this.form.controls.parentName.value,
      experience: this.form.controls.experience.value,
      role: this.form.controls.role.value,
      isAvailable: true,
    };
    this.api.createInfo(request).subscribe(
      (response: CreateInFoResponse) => {
        this.callAlert('Ok', 'Tạo mới thành công');
        this.role = request.role;
        this.isLoading = true;
        this.isSuccess = true;
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.isSuccess = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi tạo mới, vui lòng thử lại');
      }
    );
  }

  changeRole(username: string, role: string): void {
    this.isLoading = true;
    this.api.updateRole(role, username).subscribe(
      (response) => {
        if (response) {
          this.isLoading = false;
          this.callAlert('Ok', 'Chỉnh sửa thành công');
          this.isSuccess = true;
        } else {
          this.isLoading = false;
          this.callAlert('Ok', 'Không thể thay đổi chức vụ. Vui lòng thử lại');
          this.isSuccess = false;
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.isSuccess = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi chỉnh sửa, vui lòng thử lại');
      }
    );
  }

  undoInfo(): void {
    this.callAlert('YN', 'Bạn có muốn khôi phục lại tài khoản này không ?');
  }

  close(): void {
    this.haveAlertOk = false;
    if (this.isSuccess) {
      this.dialogRef.close(this.role);
    }
  }

  doYes(): void {
    this.editInfo();
    this.haveAlertYN = false;
  }

  doNo(): void {
    this.haveAlertYN = false;
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
