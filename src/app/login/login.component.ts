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
          this.route.navigate(['/dashboard/curriculum']);
        } else if (this.loginResponse?.role === 'manager') {
          this.route.navigate(['/manager-dashboard/class-management']);
        } else if (this.loginResponse.role === 'teacher') {
          this.route.navigate(['/teacher-dashboard/main']);
        } else if (this.loginResponse.role === 'staff') {
          this.route.navigate(['/manager-dashboard/guest-booking']);
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'C?? l???i x???y ra khi ????ng nh???p, vui l??ng th??? l???i');
      }
    );
  }

  validate() {
    let username = this.loginForm.controls.username.value;
    let password = this.loginForm.controls.password.value;
    if (!username || username == '') {
      this.toast.error('T??n ????ng nh???p kh??ng ???????c ????? tr???ng');
      return;
    }
    if (!password || password == '') {
      this.toast.error('M???t kh???u kh??ng ???????c ????? tr???ng');
      return;
    }

    // 02/12/2021 QuangHN Add validation invalid for login START
    if (this.validationService.isInvalidInput(username, 'T??n ????ng nh???p')) {
      return;
    }
    if (this.validationService.isInvalidInput(password, 'M???t kh???u')) {
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
