import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AvatarDialogComponent } from 'src/app/dashboard/info/avatar-dialog/avatar-dialog.component';
import { ImageRequest, ImageResponse } from 'src/interfaces/Account';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-manager-avatar',
  templateUrl: './manager-avatar.component.html',
  styleUrls: ['./manager-avatar.component.scss'],
})
export class ManagerAvatarComponent implements OnInit {
  url: string | ArrayBuffer | null | undefined;
  username: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AvatarDialogComponent>,
    private api: ApiService
  ) {}

  isLoading: boolean = false;
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  isSuccess: boolean = false;

  ngOnInit(): void {
    this.username = this.data;
  }

  onSelectFile(event: any) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        if (event.target?.result) {
          this.url = event.target.result;
        }
      };
    }
  }

  uploadImage() {
    this.isLoading = true;
    const request: ImageRequest = {
      image: this.url?.toString().split(',').pop(),
      keyword: 'avatar',
    };
    this.api.uploadImage(request, this.username).subscribe(
      (response: ImageResponse) => {
        if (response.result) {
          this.callAlert('Ok', 'Đổi ảnh đại diện thành công');
          this.isSuccess = true;
        } else {
          this.callAlert('Ok', 'Có lỗi xảy ra, vui lòng thử lại');
          this.isSuccess = false;
        }
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.callAlert('Ok', 'Có lỗi xảy ra, vui lòng thử lại');
        this.isLoading = false;
        this.isSuccess = false;
      }
    );
  }

  close(): void {
    this.haveAlertOk = false;
    if (this.isSuccess) {
      this.dialogRef.close(this.url);
    }
  }

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
