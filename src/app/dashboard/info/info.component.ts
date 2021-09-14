import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginResponse } from 'src/app/interfaces/Account';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { AvatarDialogComponent } from './avatar-dialog/avatar-dialog.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog,
  ) {}

  // for alert, loading
  isLoading: boolean = true;
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  //model
  info?: LoginResponse;
  //form
  form = this.formBuilder.group({
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
  url?: string;
  isUpload: boolean = false;

  ngOnInit(): void {
    this.info = this.localStorageService.get('user');
    this.setValue();
  }

  setValue(): void {
    this.form.controls.username.setValue(this.info?.username);
    this.form.controls.name.setValue(this.info?.name);
    this.form.controls.email.setValue(this.info?.email);
    this.form.controls.phone.setValue(this.info?.phone);
    this.form.controls.address.setValue(this.info?.address);
    this.form.controls.birthday.setValue(this.info?.birthday);
    this.birthday = this.info?.birthday;
    this.form.controls.branchName.setValue(this.info?.branchName);
    this.form.controls.branchId.setValue(this.info?.branchId);
    this.form.controls.creatingDate.setValue(this.info?.creatingDate);
    this.form.controls.parentPhone.setValue(this.info?.parentPhone);
    this.form.controls.parentName.setValue(this.info?.parentName);
    this.form.controls.experience.setValue(this.info?.experience);
    this.form.controls.rating.setValue(this.info?.rating);
    this.form.controls.role.setValue(this.info?.role);
    this.form.controls.image.setValue(this.info?.image);
    this.url = this.info?.image;
    this.creatingDate = this.info?.creatingDate;
    this.role = this.info?.role;
    if (this.info?.parentName || this.info?.parentPhone) {
      this.isHavingParent = true;
    } else {
      this.isHavingParent = false;
    }
    this.isLoading = false;
  }

  openAvatarDialog():void{
    let dialogRef = this.dialog.open(AvatarDialogComponent, {
      data: this.info?.username
    });
    dialogRef.afterClosed().subscribe(
      (data: string) => {
        if(data){
          this.url = data;
          if(this.info){
            let request: LoginResponse = this.info;
            request.image = this.url;
            this.localStorageService.set('user', request);
            window.location.reload();
          }
        }
      }
    )
  }

  editInfo(): void {
    this.isLoading = true;
    const request: LoginResponse = {
      username: this.form.controls.username.value,
      name: this.form.controls.name.value,
      email: this.form.controls.email.value,
      phone: this.form.controls.phone.value,
      address: this.form.controls.address.value,
      birthday: this.birthday,
      image: this.url,
      branchId: this.info?.branchId,
      parentPhone: this.form.controls.parentPhone.value,
      parentName: this.form.controls.parentName.value,
      experience: this.form.controls.experience.value,
      role: this.info?.role,
      creatingDate: this.info?.creatingDate,
      branchName: this.info?.branchName
    };    
    this.api.editInfo(request).subscribe(
      (response: boolean) => {
        this.isLoading = false;
        if (response) {
          this.callAlert('Ok', 'Chỉnh sửa thành công');
          this.localStorageService.set('user', request);
          this.ngOnInit();
        } else {
          this.callAlert('Ok', 'Tên chương trình đã tồn tại. Vui lòng thử lại');
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi chỉnh sửa, vui lòng thử lại');
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
