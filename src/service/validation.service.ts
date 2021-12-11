import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor(private toast: ToastrService) {}

  inputNum: number = 100;
  textAreaNum: number = 500;

  isNull(value: any, name: string): boolean {
    if (!value || value == '') {
      this.toast.error(name + ' không được để trống');
      return true;
    }
    return false;
  }

  isInvalidEmail(value: any): boolean {
    let emailRegex = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$');
    if (value) {
      if (!emailRegex.test(value)) {
        this.toast.error('Email không hợp lệ');
        return true;
      }
      return false;
    }
    return false;
  }

  isInvalidPhone(value: any): boolean {
    let phoneRegex = new RegExp(
      '^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$'
    );
    if (value) {
      if (!phoneRegex.test(value)) {
        this.toast.error('Số điện thoại không hợp lệ');
        return true;
      }
      return false;
    }
    return false;
  }

  isInvalidInput(
    value: string,
    name: string,
    numberOfCharacter?: number
  ): boolean {
    let num = this.inputNum;
    if (value) {
      if (numberOfCharacter) {
        num = numberOfCharacter;
      }
      if (value.length > num) {
        this.toast.error(name + ' không được quá ' + num + ' ký tự!');
        return true;
      }
      return false;
    }
    return false;
  }

  isInvalidTextArea(
    value: string,
    name: string,
    numberOfCharacter?: number
  ): boolean {
    if (value) {
      let num = this.textAreaNum;
      if (numberOfCharacter) {
        num = numberOfCharacter;
      }
      if (value.length > num) {
        this.toast.error(name + ' không được quá ' + num + ' ký tự!');
        return true;
      }
      return false;
    }
    return false;
  }
}
