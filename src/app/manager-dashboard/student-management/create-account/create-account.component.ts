import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateInFoResponse, LoginResponse } from 'src/interfaces/Account';
import { StudentResponse } from 'src/interfaces/Student';
import { TeacherInfo } from 'src/interfaces/Teacher';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';
import { ValidationService } from 'src/service/validation.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateAccountComponent>,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private localStorage: LocalStorageService,
    private validationService: ValidationService
  ) {}

  // for alert, loading
  isLoading: boolean = false;
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  //model
  student?: StudentResponse;
  teacher?: TeacherInfo;
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
  branchId?: number;
  path?: string;
  role?: string;
  url: string =
    'https://firebasestorage.googleapis.com/v0/b/app-test-c1bfb.appspot.com/o/ea35e7fa-19ab-4ea0-9890-5a310173d4a6.jpg?alt=media';
  isUpload: boolean = false;
  //for task
  type: string = '';
  isSuccess: boolean = false;

  ngOnInit(): void {
    this.type = this.data.type;
    let user = this.localStorage.get('user');
    this.branchId = user.branchId;
    if (this.type === 'createStudent') {
      this.role = 'student';
    } else if (this.type === 'editStudent') {
      this.student = this.data.param;
      this.role = 'student';
      this.setValueStudentEdit();
    } else if (this.type === 'createTeacher') {
      this.role = 'teacher';
    } else if (this.type === 'editTeacher') {
      this.teacher = this.data.param;
      this.role = 'teacher';
      this.setValueTeacherEdit();
    }
  }

  setValueStudentEdit(): void {
    this.form.controls.username.setValue(this.student?.username);
    this.form.controls.name.setValue(this.student?.name);
    this.form.controls.email.setValue(this.student?.email);
    this.form.controls.phone.setValue(this.student?.phone);
    this.form.controls.address.setValue(this.student?.address);
    this.form.controls.birthday.setValue(this.student?.birthday);
    this.form.controls.branchId.setValue(this.branchId);
    this.birthday = this.student?.birthday;
    this.form.controls.parentPhone.setValue(this.student?.parentPhone);
    this.form.controls.parentName.setValue(this.student?.parentName);
    this.form.controls.role.setValue(this.student?.role);
    this.form.controls.image.setValue(this.student?.image);
    if (this.student?.image) {
      this.url = this.student?.image;
    }
  }

  setValueTeacherEdit(): void {
    this.form.controls.username.setValue(this.teacher?.teacherUsername);
    this.form.controls.name.setValue(this.teacher?.teacherName);
    this.form.controls.email.setValue(this.teacher?.teacherEmail);
    this.form.controls.phone.setValue(this.teacher?.teacherPhone);
    this.form.controls.address.setValue(this.teacher?.teacherAddress);
    this.form.controls.birthday.setValue(this.teacher?.teacherBirthday);
    this.form.controls.branchId.setValue(this.branchId);
    this.birthday = this.teacher?.teacherBirthday;
    this.form.controls.creatingDate.setValue(this.teacher?.teacherStartingDate);
    this.form.controls.experience.setValue(this.teacher?.teacherExperience);
    this.form.controls.role.setValue(this.teacher?.role);
    this.form.controls.image.setValue(this.teacher?.teacherImage);
    if (this.teacher?.teacherImage) {
      this.url = this.teacher?.teacherImage;
    }
    this.creatingDate = this.teacher?.teacherStartingDate;
  }

  editInfo(): void {
    // 06/12/2021 QuangHN Add validate for edit account student form START
    let name = this.form.controls.name.value;
    let birthday = this.form.controls.birthday.value;
    let address = this.form.controls.address.value;
    let phone = this.form.controls.phone.value;
    let email = this.form.controls.email.value;
    let experience = this.form.controls.experience.value;
    let parentName = this.form.controls.parentName.value;
    let parentPhone = this.form.controls.parentPhone.value;
    let role = this.role;

    // check null
    if (this.validationService.isNull(name, 'Họ và tên')) {
      return;
    }
    if (this.validationService.isNull(birthday, 'Ngày sinh')) {
      return;
    }
    if (this.validationService.isNull(address, 'Địa chỉ')) {
      return;
    }
    if (this.validationService.isNull(phone, 'Số điện thoại')) {
      return;
    }
    if (this.validationService.isNull(email, 'Email')) {
      return;
    }

    // check invalid
    if (this.validationService.isInvalidInput(name, 'Họ và tên')) {
      return;
    }
    if (this.validationService.isInvalidTextArea(address, 'Địa chỉ')) {
      return;
    }
    if (this.validationService.isInvalidPhone(phone)) {
      return;
    }
    if (this.validationService.isInvalidEmail(email)) {
      return;
    }
    if (this.role == 'teacher') {
      if (
        this.validationService.isInvalidTextArea(
          experience,
          'Kinh nghiệm giảng dạy'
        )
      ) {
        return;
      }
    }
    if (this.role == 'student') {
      if (this.validationService.isInvalidInput(parentName, 'Tên phụ huynh')) {
        return;
      }
      if (this.validationService.isInvalidPhone(parentPhone)) {
        return;
      }
    }

    // 06/12/2021 QuangHN Add validate for edit account student form END

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
      branchId: this.branchId,
      parentPhone: this.form.controls.parentPhone.value,
      parentName: this.form.controls.parentName.value,
      experience: this.form.controls.experience.value,
      role: this.role,
      isAvailable: true,
    };
    this.api.editInfo(request).subscribe(
      (response: boolean) => {
        if (response) {
          this.callAlert('Ok', 'Chỉnh sửa thành công');
          this.isSuccess = true;
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
    // 06/12/2021 QuangHN Add validate for create account student form START
    let name = this.form.controls.name.value;
    let birthday = this.form.controls.birthday.value;
    let address = this.form.controls.address.value;
    let phone = this.form.controls.phone.value;
    let email = this.form.controls.email.value;
    let experience = this.form.controls.experience.value;
    let parentName = this.form.controls.parentName.value;
    let parentPhone = this.form.controls.parentPhone.value;

    // check null
    if (this.validationService.isNull(name, 'Họ và tên')) {
      return;
    }
    if (this.validationService.isNull(birthday, 'Ngày sinh')) {
      return;
    }
    if (this.validationService.isNull(address, 'Địa chỉ')) {
      return;
    }
    if (this.validationService.isNull(phone, 'Số điện thoại')) {
      return;
    }
    if (this.validationService.isNull(email, 'Email')) {
      return;
    }

    // check invalid
    if (this.validationService.isInvalidInput(name, 'Họ và tên')) {
      return;
    }
    if (this.validationService.isInvalidTextArea(address, 'Địa chỉ')) {
      return;
    }
    if (this.validationService.isInvalidPhone(phone)) {
      return;
    }
    if (this.validationService.isInvalidEmail(email)) {
      return;
    }
    if (this.role == 'teacher') {
      if (
        this.validationService.isInvalidTextArea(
          experience,
          'Kinh nghiệm giảng dạy'
        )
      ) {
        return;
      }
    }
    if (this.role == 'student') {
      if (this.validationService.isInvalidInput(parentName, 'Tên phụ huynh')) {
        return;
      }
      if (this.validationService.isInvalidParentPhone(parentPhone)) {
        return;
      }
    }
    // 06/12/2021 QuangHN Add validate for create account student form END
    this.isLoading = true;
    this.birthday = this.form.controls.birthday.value;
    const request: LoginResponse = {
      name: this.form.controls.name.value,
      email: this.form.controls.email.value,
      phone: this.form.controls.phone.value,
      address: this.form.controls.address.value,
      birthday: this.form.controls.birthday.value,
      image: this.url,
      branchId: this.branchId,
      parentPhone: this.form.controls.parentPhone.value,
      parentName: this.form.controls.parentName.value,
      experience: this.form.controls.experience.value,
      role: this.role,
      isAvailable: true,
    };
    this.api.createInfo(request).subscribe(
      (response: CreateInFoResponse) => {
        this.callAlert('Ok', 'Tạo mới thành công');
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

  close(): void {
    this.haveAlertOk = false;
    if (this.isSuccess) {
      this.dialogRef.close(this.isSuccess);
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
