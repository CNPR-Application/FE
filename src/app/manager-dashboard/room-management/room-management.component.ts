import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginResponse } from 'src/interfaces/Account';
import { RoomResponse } from 'src/interfaces/Room';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';
import { RoomDialogComponent } from './room-dialog/room-dialog.component';

@Component({
  selector: 'app-room-management',
  templateUrl: './room-management.component.html',
  styleUrls: ['./room-management.component.scss'],
})
export class RoomManagementComponent implements OnInit {
  constructor(
    private localStorage: LocalStorageService,
    private dialog: MatDialog,
    private api: ApiService
  ) {}

  isAvailable: boolean = true;
  isLoading: boolean = false;
  branchId?: number;
  roomArray?: Array<RoomResponse>;
  currentPage: number = 1;
  pageArray?: Array<number>;
  imageArray: Array<string> = [
    'assets/image/room.jpg',
    'assets/image/room2.jpg',
    'assets/image/room3.jpg',
    'assets/image/room4.jpg',
    'assets/image/room5.jpg',
    'assets/image/room6.jpg',
    'assets/image/room7.jpg',
  ];
  clickedRoom?: RoomResponse;

  ngOnInit(): void {
    let user: LoginResponse = this.localStorage.get('user');
    this.branchId = user.branchId;
    this.getAllRoom();
  }

  getAllRoom(): void {
    if (this.branchId) {
      this.isLoading = true;
      this.api
        .getRoomByBranchIsAvailable(
          this.branchId,
          this.isAvailable,
          this.currentPage,
          15
        )
        .subscribe(
          (response) => {
            this.roomArray = response.roomList;
            this.currentPage = response.pageNo;
            this.pageArray = Array(response.pageTotal)
              .fill(1)
              .map((x, i) => i + 1)
              .reverse();
            this.isLoading = false;
          },
          (error) => {
            console.error(error);
            this.isLoading = false;
            this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
          }
        );
    }
  }

  changePage(pageNo: number) {
    this.currentPage = pageNo;
    this.getAllRoom();
  }

  changeStatus(isAvailable: boolean) {
    this.isAvailable = isAvailable;
    this.getAllRoom();
  }

  openDialog(type: string, room?: RoomResponse) {
    let dialogRef = this.dialog.open(RoomDialogComponent, {
      data: {
        type: type,
        param: room,
        branchId: this.branchId,
      },
    });
    dialogRef.afterClosed().subscribe((data: string) => {
      if (data) {
        this.getAllRoom();
      }
    });
  }

  deleteRoom() {
    if (this.clickedRoom?.roomId) {
      this.isLoading = true;
      this.api.deleteRoom(this.clickedRoom?.roomId).subscribe(
        (response: boolean) => {
          this.isLoading = false;
          if (response) {
            this.callAlert('Ok', 'Xóa thành công');
            this.getAllRoom();
          } else {
            this.callAlert('Ok', 'Có lỗi xảy ra khi xóa, vui lòng thử lại');
          }
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          console.log(error);
          if (
            error.error ===
            "Can not delete Room because Room's Sessions are still available!"
          ) {
            this.callAlert(
              'Ok',
              'Phòng này không thể xóa vì hiện đang có lớp học'
            );
          } else {
            this.callAlert('Ok', 'Có lỗi xảy ra khi xóa, vui lòng thử lại');
          }
        }
      );
    }
  }

  recoverRoom() {
    if (this.clickedRoom?.roomId) {
      this.isLoading = true;
      let request: RoomResponse = {
        roomId: this.clickedRoom.roomId,
        roomName: this.clickedRoom.roomName,
        isAvailable: true,
      };
      this.api.editRoom(request).subscribe(
        (response: boolean) => {
          this.isLoading = false;
          if (response) {
            this.callAlert('Ok', 'Khôi phục thành công');
            this.getAllRoom();
          } else {
            this.callAlert(
              'Ok',
              'Có lỗi xảy ra khi khôi phục, vui lòng thử lại'
            );
          }
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          console.log(error);
          this.callAlert('Ok', 'Có lỗi xảy ra khi khôi phục, vui lòng thử lại');
        }
      );
    }
  }

  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  doYes(): void {
    this.haveAlertYN = false;
    if (this.alertMessage === 'Bạn có chắc chắn muốn xóa phòng này không?') {
      this.deleteRoom();
    } else if (
      this.alertMessage === 'Bạn có chắc chắn muốn khôi phục phòng này không?'
    ) {
      this.recoverRoom();
    }
  }

  doNo(): void {
    this.haveAlertYN = false;
  }

  callAlert(type: string, message: string, param?: any) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
      if (param) {
        this.clickedRoom = param;
      }
    }
  }
}
