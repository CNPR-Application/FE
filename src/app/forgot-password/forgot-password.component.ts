import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  constructor(private api: ApiService, private formBuilder: FormBuilder) {}

  //form
  form = this.formBuilder.group({
    username: ['', Validators.required],
  });

  // for alert, loading
  isLoading: boolean = false;
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  ngOnInit(): void {}

  forgotPassword() {
    this.isLoading = true;
    let username = this.form.controls.username.value;
    this.api.forgotPassword(username).subscribe(
      (response: boolean) => {
        this.isLoading = false;
        if (response) {
          this.callAlert(
            'Ok',
            'Mật khẩu đã được gửi đến email đăng ký tài khoản của bạn, vui lòng kiểm tra email !'
          );
        } else {
          this.callAlert('Ok', 'Có lỗi xảy ra, vui lòng thử lại!');
        }
      },
      (error) => {
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra, vui lòng thử lại!');
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
}
