import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Shift, ShiftArray } from 'src/app/models/Shift';
import { ApiService } from 'src/app/services/api.service';
import { ShiftDialogComponent } from './shift-dialog/shift-dialog.component';
import { DAY_OF_WEEKS } from 'src/app/models/Shift';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss'],
})
export class ShiftComponent implements OnInit {
  constructor(private api: ApiService, private dialog: MatDialog) {}

  shiftArray?: Array<Shift>;
  //loading
  isLoading: boolean = true;
  //search
  keyBranch: string = '';
  //paging
  totalPage?: number;
  currentPage?: number;
  pageArray?: Array<number>;

  dayOfWeek: string[] = [];
  dayArray = DAY_OF_WEEKS;
  //khôi phục
  isAvailable: boolean = true;
  clickId: number = 0;

  ngOnInit(): void {
    this.getAllShift(1, this.isAvailable);
  }

  getAllShift(pageNo: number, isAvailable: boolean) {
    this.isLoading = true;
    this.api.getAllShift(pageNo, 15, isAvailable).subscribe(
      (response: ShiftArray) => {
        this.shiftArray = response.shiftDtos;
        this.pageArray = Array(this.totalPage)
          .fill(1)
          .map((x, i) => i + 1)
          .reverse();
        this.currentPage = response.pageNo;
        this.totalPage = response.pageTotal;
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
      }
    );
  }

  viewCurrentShift(): void {
    if (!this.isAvailable) {
      this.isAvailable = true;
      this.getAllShift(1, this.isAvailable);
    }
  }

  viewDeletedShift(): void {
    if (this.isAvailable) {
      this.isAvailable = false;
      this.getAllShift(1, this.isAvailable);
    }
  }

  changePage(page: number): void {
    this.getAllShift(page, this.isAvailable);
  }

  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  callAlert(type: string, message: string, param?: any) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
    }
    this.clickId = param;
  }

  createShift(shift?: Shift): void {
    let dialogRef = this.dialog.open(ShiftDialogComponent, {
      data: { shift: shift },
    });
    dialogRef.afterClosed().subscribe((data: boolean) => {
      if (data) {
        this.getAllShift(1, true);
      }
    });
  }

  deleteShift(): void {
    if (this.clickId !== 0) {
      this.isLoading = true;
      this.api.deleteShift(this.clickId).subscribe(
        (response: boolean) => {
          if (response) {
            this.callAlert('Ok', 'Xóa ca học thành công');
          } else {
            this.callAlert('Ok', 'Không thể xóa vì đang được sử dụng');
          }
          this.isLoading = false;
          this.getAllShift(1, this.isAvailable);
        },
        (error) => {
          console.log(error);
          this.callAlert('Ok', 'Có lỗi xảy ra, vui lòng thử lại');
          this.isLoading = false;
        }
      );
    }
  }
  recoverShift(): void {
    if (this.clickId !== 0) {
      this.isLoading = true;
      this.api.recoverShift(this.clickId).subscribe(
        (response: boolean) => {
          if (response) {
            this.callAlert('Ok', 'Khôi phục ca học thành công');
          } else {
            this.callAlert('Ok', 'Không thể khôi phục vì không tìm thấy');
          }
          this.isLoading = false;
          this.getAllShift(1, this.isAvailable);
        },
        (error) => {
          console.log(error);
          this.callAlert('Ok', 'Có lỗi xảy ra, vui lòng thử lại');
          this.isLoading = false;
        }
      );
    }
  }

  doYes(): void {
    if (this.alertMessage === 'Bạn có muốn xóa ca học này hay không?') {
      this.deleteShift();
    } else {
      this.recoverShift();
    }
    this.haveAlertYN = false;
  }

  doNo(): void {
    this.haveAlertYN = false;
  }
}
