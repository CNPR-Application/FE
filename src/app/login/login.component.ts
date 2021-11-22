import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/service/authentication.service';
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
    private authenticationService: AuthenticationService
  ) {
    authenticationService.logout();
  }

  private loginResponse?: LoginResponse;
  isLoading: boolean = false;
  ngOnInit(): void {}
  onSubmit(): void {
    const loginRequest: LoginRequest = {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value,
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
