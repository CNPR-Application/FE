import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/service/authentication.service';
import { ValidationService } from 'src/service/validation.service';
import { LoginRequest, LoginResponse } from '../../interfaces/Account';
import { ApiService } from '../../service/api.service';
import { LocalStorageService } from '../../service/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  constructor(
    private formBuilder: FormBuilder,
    private service: ApiService,
    private route: Router,
    private localStorageService: LocalStorageService,
    private authenticationService: AuthenticationService,
    private toast: ToastrService,
    private validationService: ValidationService
  ) {
    authenticationService.logout();
  }

  private loginResponse?: LoginResponse;
  isLoading: boolean = false;
  ngOnInit(): void {}
  onSubmit(): void {
    const loginRequest: LoginRequest = {
      username: this.loginForm.controls.username.value.trim(),
      password: this.loginForm.controls.password.value.trim(),
    };
    this.isLoading = true;
    this.service.checkLogin(loginRequest).subscribe(
      (response: LoginResponse) => {
        this.loginResponse = response;
        response.username = this.loginForm.controls.username.value;
        this.isLoading = false;
        this.localStorageService.set('user', response);
        this.authenticationService.login(response);
        if (this.loginResponse?.role === 'admin') {
          this.route.navigate(['/dashboard/main']);
        } else if (
          this.loginResponse?.role === 'manager' ||
          this.loginResponse?.role === 'staff'
        ) {
          this.route.navigate(['/manager-dashboard/main']);
        } else if (this.loginResponse.role === 'teacher') {
          this.route.navigate(['/teacher-dashboard/main']);
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi đăng nhập, vui lòng thử lại');
      }
    );
  }

  validate() {
    let username = this.loginForm.controls.username.value;
    let password = this.loginForm.controls.password.value;
    if (!username || username == '') {
      this.toast.error('Tên đăng nhập không được để trống');
      return;
    }
    if (!password || password == '') {
      this.toast.error('Mật khẩu không được để trống');
      return;
    }

    // 02/12/2021 QuangHN Add validation invalid for login START
    if (this.validationService.isInvalidInput(username, 'Tên đăng nhập')) {
      return;
    }
    if (this.validationService.isInvalidInput(password, 'Mật khẩu')) {
      return;
    }
    // 02/12/2021 QuangHN Add validation invalid for login END

    this.onSubmit();
  }

  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  doYes(): void {
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
