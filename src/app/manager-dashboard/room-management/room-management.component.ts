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
            this.pageArray = Array(response.totalPage)
              .fill(1)
              .map((x, i) => i + 1)
              .reverse();
            this.isLoading = false;
          },
          (error) => {
            console.error(error);
            this.isLoading = false;
            this.callAlert('Ok', 'C?? l???i x???y ra khi t???i, vui l??ng th??? l???i');
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
            this.callAlert('Ok', 'X??a th??nh c??ng');
            this.getAllRoom();
          } else {
            this.callAlert('Ok', 'C?? l???i x???y ra khi x??a, vui l??ng th??? l???i');
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
              'Ph??ng n??y kh??ng th??? x??a v?? hi???n ??ang c?? l???p h???c'
            );
          } else {
            this.callAlert('Ok', 'C?? l???i x???y ra khi x??a, vui l??ng th??? l???i');
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
            this.callAlert('Ok', 'Kh??i ph???c th??nh c??ng');
            this.getAllRoom();
          } else {
            this.callAlert(
              'Ok',
              'C?? l???i x???y ra khi kh??i ph???c, vui l??ng th??? l???i'
            );
          }
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          console.log(error);
          this.callAlert('Ok', 'C?? l???i x???y ra khi kh??i ph???c, vui l??ng th??? l???i');
        }
      );
    }
  }

  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  doYes(): void {
    this.haveAlertYN = false;
    if (this.alertMessage === 'B???n c?? ch???c ch???n mu???n x??a ph??ng n??y kh??ng?') {
      this.deleteRoom();
    } else if (
      this.alertMessage === 'B???n c?? ch???c ch???n mu???n kh??i ph???c ph??ng n??y kh??ng?'
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
