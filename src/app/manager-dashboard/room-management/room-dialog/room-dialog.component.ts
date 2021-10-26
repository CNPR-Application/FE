import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoomCreateRequest, RoomResponse } from 'src/interfaces/Room';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-room-dialog',
  templateUrl: './room-dialog.component.html',
  styleUrls: ['./room-dialog.component.scss'],
})
export class RoomDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<RoomDialogComponent>,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) {}

  // for alert, loading
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  isSuccess: boolean = false;

  form = this.formBuilder.group({
    roomId: ['', Validators.required],
    roomName: ['', Validators.required],
    branchId: ['', Validators.required],
  });

  type?: string;
  room?: RoomResponse;

  ngOnInit(): void {
    this.type = this.data.type;
    this.form.controls.branchId.setValue(this.data.branchId);
    if (this.type === 'edit') {
      this.room = this.data.param;
      this.form.controls.roomId.setValue(this.room?.roomId);
      this.form.controls.roomName.setValue(this.room?.roomName);
    }
  }

  createRoom() {
    let request: RoomCreateRequest = {
      branchId: this.form.controls.branchId.value,
      roomName: this.form.controls.roomName.value,
    };
    this.api.createRoom(request).subscribe(
      (response: boolean) => {
        if (response) {
          this.callAlert('Ok', 'Tạo mới thành công');
          this.isSuccess = true;
          this.close();
        } else {
          this.callAlert('Ok', 'Có lỗi xảy ra khi tạo mới, vui lòng thử lại');
        }
      },
      (error) => {
        console.log(error);
        this.callAlert('Ok', 'Có lỗi xảy ra khi tạo mới, vui lòng thử lại');
      }
    );
  }

  editRoom() {
    let request: RoomResponse = {
      roomId: this.form.controls.roomId.value,
      roomName: this.form.controls.roomName.value,
    };
    this.api.editRoom(request).subscribe(
      (response: boolean) => {
        if (response) {
          this.callAlert('Ok', 'Chỉnh sửa thành công');
          this.isSuccess = true;
        } else {
          this.callAlert('Ok', 'Có lỗi xảy ra khi chỉnh sửa, vui lòng thử lại');
        }
      },
      (error) => {
        console.log(error);
        this.callAlert('Ok', 'Có lỗi xảy ra khi chỉnh sửa, vui lòng thử lại');
      }
    );
  }

  doOk(): void {
    this.haveAlertOk = false;
    this.close();
  }

  close(): void {
    this.haveAlertOk = false;
    if (this.isSuccess) {
      this.dialogRef.close(this.isSuccess);
    }
  }

  callAlert(type: string, message: string) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
    }
  }

  doYes(): void {
    this.haveAlertYN = false;
  }

  doNo(): void {
    this.haveAlertYN = false;
  }
}
