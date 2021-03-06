import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateInFoResponse, LoginResponse } from 'src/interfaces/Account';
import { Branch, BranchArray } from 'src/interfaces/Branch';
import { shiftModel } from 'src/interfaces/Shift';
import { ApiService } from 'src/service/api.service';
import { ValidationService } from 'src/service/validation.service';

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
    private formBuilder: FormBuilder,
    private validationService: ValidationService
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
    { id: 1, value: 'manager', trans: 'qu???n l??' },
    { id: 2, value: 'staff', trans: 'nh??n vi??n' },
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
        this.callAlert('Ok', 'C?? l???i x???y ra khi t???i, vui l??ng th??? l???i');
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
    // 06/12/2021 QuangHN Add Validate for edit staff form START
    let name = this.form.controls.name.value;
    let birthday = this.form.controls.birthday.value;
    let address = this.form.controls.address.value;
    let phone = this.form.controls.phone.value;
    let email = this.form.controls.email.value;
    let branchId = this.form.controls.branchId.value;
    let role = this.form.controls.role.value;

    // check null
    if (this.validationService.isNull(name, 'H??? v?? t??n')) {
      return;
    }
    if (this.validationService.isNull(birthday, 'Ng??y sinh')) {
      return;
    }
    if (this.validationService.isNull(address, '?????a ch???')) {
      return;
    }
    if (this.validationService.isNull(phone, 'S??? ??i???n tho???i')) {
      return;
    }
    if (this.validationService.isNull(email, 'Email')) {
      return;
    }
    if (this.validationService.isNull(branchId, 'T??n chi nh??nh')) {
      return;
    }
    if (this.validationService.isNull(role, 'Ch???c v???')) {
      return;
    }

    // check invalid
    if (this.validationService.isInvalidInput(name, 'H??? v?? t??n')) {
      return;
    }
    if (this.validationService.isInvalidTextArea(address, '?????a ch???')) {
      return;
    }
    if (this.validationService.isInvalidPhone(phone)) {
      return;
    }
    if (this.validationService.isInvalidEmail(email)) {
      return;
    }
    // 06/12/2021 QuangHN Add Validate for edit staff form END

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
          this.callAlert('Ok', 'T??n ch????ng tr??nh ???? t???n t???i, vui l??ng th??? l???i');
          this.isSuccess = false;
          this.isLoading = false;
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.isSuccess = false;
        this.callAlert('Ok', 'C?? l???i x???y ra khi ch???nh s???a, vui l??ng th??? l???i');
      }
    );
  }

  createInfo(): void {
    // 06/12/2021 QuangHN Add Validate for create staff form START
    let name = this.form.controls.name.value;
    let birthday = this.form.controls.birthday.value;
    let address = this.form.controls.address.value;
    let phone = this.form.controls.phone.value;
    let email = this.form.controls.email.value;
    let branchId = this.form.controls.branchId.value;
    let role = this.form.controls.role.value;

    // check null
    if (this.validationService.isNull(name, 'H??? v?? t??n')) {
      return;
    }
    if (this.validationService.isNull(birthday, 'Ng??y sinh')) {
      return;
    }
    if (this.validationService.isNull(address, '?????a ch???')) {
      return;
    }
    if (this.validationService.isNull(phone, 'S??? ??i???n tho???i')) {
      return;
    }
    if (this.validationService.isNull(email, 'Email')) {
      return;
    }
    if (this.validationService.isNull(branchId, 'T??n chi nh??nh')) {
      return;
    }
    if (this.validationService.isNull(role, 'Ch???c v???')) {
      return;
    }

    // check invalid
    if (this.validationService.isInvalidEmail(email)) {
      return;
    }
    if (this.validationService.isInvalidPhone(phone)) {
      return;
    }
    if (this.validationService.isInvalidInput(name, 'H??? v?? t??n')) {
      return;
    }
    if (this.validationService.isInvalidTextArea(address, '?????a ch???')) {
      return;
    }
    // 06/12/2021 QuangHN Add Validate for create staff form END

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
        this.callAlert('Ok', 'T???o m???i th??nh c??ng');
        this.role = request.role;
        this.isLoading = true;
        this.isSuccess = true;
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.isSuccess = false;
        this.callAlert('Ok', 'C?? l???i x???y ra khi t???o m???i, vui l??ng th??? l???i');
      }
    );
  }

  changeRole(username: string, role: string): void {
    this.isLoading = true;
    this.api.updateRole(role, username).subscribe(
      (response) => {
        if (response) {
          this.isLoading = false;
          this.callAlert('Ok', 'Ch???nh s???a th??nh c??ng');
          this.isSuccess = true;
        } else {
          this.isLoading = false;
          this.callAlert('Ok', 'C?? l???i x???y ra khi ch???nh s???a, vui l??ng th??? l???i');
          this.isSuccess = false;
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.isSuccess = false;
        this.callAlert('Ok', 'C?? l???i x???y ra khi ch???nh s???a, vui l??ng th??? l???i');
      }
    );
  }

  undoInfo(): void {
    this.callAlert('YN', 'B???n c?? mu???n kh??i ph???c t??i kho???n n??y kh??ng ?');
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
