import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Guest } from 'src/interfaces/Account';
import { Branch, BranchArray } from 'src/interfaces/Branch';
import {
  CurriculumResponse,
  CurriculumResponseArray,
} from 'src/interfaces/Curriculum';
import { CITY } from 'src/interfaces/Shift';
import { ApiService } from 'src/service/api.service';
import { ValidationService } from 'src/service/validation.service';

@Component({
  selector: 'app-guest-contact',
  templateUrl: './guest-contact.component.html',
  styleUrls: ['./guest-contact.component.scss'],
})
export class GuestContactComponent implements OnInit {
  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService
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
    // 02/12/2021 QuangHN Add Validate START
    let name = this.form.controls.name.value;
    let phone = this.form.controls.phone.value;
    let city = this.form.controls.city.value;
    let description = this.form.controls.description.value;
    let branchId = this.form.controls.branchId.value;
    let curriculumId = this.form.controls.curriculumId.value;

    // check null
    if (this.validationService.isNull(name, 'Họ và tên')) {
      return;
    }
    if (this.validationService.isNull(phone, 'Số điện thoại')) {
      return;
    }
    if (this.validationService.isNull(city, 'Thành phố')) {
      return;
    }
    if (this.validationService.isNull(branchId, 'Chi nhánh gần bạn')) {
      return;
    }
    if (this.validationService.isNull(curriculumId, 'Chương trình quan tâm')) {
      return;
    }

    // check invalid
    if (this.validationService.isInvalidInput(name, 'Họ và tên')) {
      return;
    }
    if (this.validationService.isInvalidPhone(phone)) {
      return;
    }
    if (this.validationService.isInvalidTextArea(description, 'Ghi chú')) {
      return;
    }
    // 02/12/2021 QuangHN Add Validate END

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

  callAlert(type: string, message: string) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
    }
  }
}
