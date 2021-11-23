import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangePasswordRequest } from 'src/interfaces/Account';
import { ApiService } from 'src/service/api.service';
import { AuthenticationService } from 'src/service/authentication.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private authenService: AuthenticationService
  ) {}

  // for alert, loading
  isLoading: boolean = false;
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  //form
  form: FormGroup = this.formBuilder.group({
    oldPass: ['', Validators.required],
    newPass: ['', Validators.required],
    reNewPass: ['', Validators.required],
  });

  isSuccess: boolean = false;

  ngOnInit(): void {}

  changePassword() {
    let user = this.authenService.currentUserValue;
    let username = user?.username;
    let request: ChangePasswordRequest = {
      oldPassword: this.form.controls.oldPass.value,
      newPassword: this.form.controls.newPass.value,
      reNewPassword: this.form.controls.reNewPass.value,
    };
    this.isLoading = true;
    if (username)
      this.api.changePassword(request, username).subscribe(
        (response: boolean) => {
          this.isLoading = false;
          if (response) {
            this.callAlert('Ok', 'Đổi mật khẩu thành công !');
            this.isSuccess = true;
          } else {
            this.callAlert(
              'Ok',
              'Có lỗi xảy ra khi đổi mật khẩu, vui lòng thử lại!'
            );
          }
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          if (error.error === 'Password not match!') {
            this.callAlert('Ok', 'Mật khẩu cũ không chính xác!');
          } else if (
            error.error ===
            'Password must has minimum six characters, at least one letter and one number!'
          ) {
            this.callAlert(
              'Ok',
              'Mật khẩu phải có ít nhất 6 ký tự gồm cả chữ và số !'
            );
          } else if (
            error.error ===
            'New password matched Old password! Please try new password'
          ) {
            this.callAlert('Ok', 'Mật khẩu mới trùng với mật khẩu cũ !');
          } else if (
            error.error ===
            'Re new password did not match new password! Please try again'
          ) {
            this.callAlert('Ok', 'Xác nhận mật khẩu mới không chính xác');
          } else {
            this.callAlert(
              'Ok',
              'Có lỗi xảy ra khi đổi mật khẩu, vui lòng thử lại!'
            );
          }
        }
      );
  }

  callAlert(type: string, message: string) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
    }
  }

  close(): void {
    this.haveAlertOk = false;
    if (this.isSuccess) {
      this.dialogRef.close();
    }
  }
}
