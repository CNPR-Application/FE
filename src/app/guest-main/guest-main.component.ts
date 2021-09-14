import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Guest } from '../interfaces/Account';
import { Branch, BranchArray } from '../interfaces/Branch';
import {
  CurriculumResponse,
  CurriculumResponseArray,
} from '../interfaces/Curriculum';
import { CITY } from '../interfaces/Shift';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-guest-main',
  templateUrl: './guest-main.component.html',
  styleUrls: ['./guest-main.component.scss'],
})
export class GuestMainComponent implements OnInit {
  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.api.getCurriculumByName('', true, 1, 1000).subscribe(
      (response: CurriculumResponse) => {
        this.curriculumList = response.curriculumResponseDtos;
        this.api.getBranchByName('', 1, 1000, true).subscribe(
          (response: BranchArray) => {
            this.branchList = response.branchResponseDtos;
          },
          (error) => {
            this.callAlert('Ok', 'Có lỗi xảy ra, vui lòng thử lại');
          }
        );
      },
      (error) => {
        this.callAlert('Ok', 'Có lỗi xảy ra, vui lòng thử lại');
      }
    );
  }
  // for alert, loading
  isLoading: boolean = false;
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  //dropdown list
  curriculumList?: Array<CurriculumResponseArray>;
  branchList?: Array<Branch>;
  cityList? = CITY;
  //form
  form = this.formBuilder.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    city: ['', Validators.required],
    description: [''],
    branchId: ['', Validators.required],
    curriculumId: ['', Validators.required],
  });

  createGuest(): void {
    const request: Guest = {
      customerName: this.form.controls.name.value,
      phone: this.form.controls.phone.value,
      branchId: this.form.controls.branchId.value,
      curriculumId: this.form.controls.curriculumId.value,
      city: this.form.controls.city.value,
      description: this.form.controls.description.value,
    };
    this.isLoading = true;
    this.api.createGuest(request).subscribe(
      (response: boolean) => {
        if (response) {
          this.isLoading = false;
          this.callAlert(
            'Ok',
            'Cám ơn bạn đã để lại thông tin. Nhân viên tư vấn sẽ liên hệ với bạn trong thời gian sớm nhất !'
          );
          this.form.reset();
        }
      },
      (error: HttpErrorResponse) => {
        this.isLoading = false;
        console.log(error);
        if (error.error === 'Invalid customer name!') {
          this.callAlert('Ok', 'Tên khách hàng không được để trống');
        } else {
          this.callAlert(
            'Ok',
            'Xin lỗi bạn nhưng có lỗi đã xảy ra. Vui lòng kiểm tra lại internet và thử lại'
          );
        }
      }
    );
  }

  login() {
    this.router.navigateByUrl('/login');
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
