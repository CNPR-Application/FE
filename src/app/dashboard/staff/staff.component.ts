import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InfoArray, LoginResponse } from 'src/interfaces/Account';
import { ApiService } from 'src/service/api.service';
import { StaffDialogComponent } from './staff-dialog/staff-dialog.component';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
})
export class StaffComponent implements OnInit {
  constructor(private api: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAccountList('staff', '', true, 1);
  }

  clickId?: LoginResponse;
  isLoading: boolean = true;
  isManager: boolean = true;

  //alert
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  //staff
  keyStaff: string = '';
  isAvailableStaff: boolean = true;
  staffResponse?: InfoArray;
  staffArray: Array<LoginResponse> | undefined;
  totalStaffPage?: number;
  currentStaffPage?: number;
  pageStaffArray?: Array<number>;

  getAccountList(
    role: string,
    username: string,
    isAvailable: boolean,
    pageNo: number
  ) {
    this.isLoading = true;
    this.api
      .searchInfoByUsername('staff', username, isAvailable, pageNo, 10)
      .subscribe(
        (response: InfoArray) => {
          this.staffResponse = response;
          this.staffArray = this.staffResponse.accountResponseDtoList;
          this.totalStaffPage = this.staffResponse.totalPage;
          this.currentStaffPage = this.staffResponse.pageNo;
          this.pageStaffArray = Array(this.totalStaffPage)
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

  deleteAccount(): void {
    if (this.clickId?.username !== undefined) {
      this.isLoading = true;
      this.api.deleteAccount(this.clickId.username).subscribe(
        (response: boolean) => {
          this.isLoading = false;
          if (response) {
            this.callAlert('Ok', 'Xóa thành công');
            this.ngOnInit();
          } else {
            this.callAlert('Ok', 'Không thể xóa người này, vui lòng thử lại');
          }
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
          this.callAlert('Ok', 'Có lỗi xảy ra khi xóa, vui lòng thử lại');
        }
      );
    }
  }

  //staff

  searchStaff(): void {
    this.getAccountList('staff', this.keyStaff, this.isAvailableStaff, 1);
  }

  createStaff(): void {
    this.goToDetail('create', 'staff');
  }

  changePageStaff(page: number): void {
    this.getAccountList('staff', this.keyStaff, this.isAvailableStaff, page);
  }

  viewCurrentStaff(): void {
    if (!this.isAvailableStaff) {
      this.isAvailableStaff = true;
      this.getAccountList('staff', '', this.isAvailableStaff, 1);
    }
  }

  viewDeletedStaff(): void {
    if (this.isAvailableStaff) {
      this.isAvailableStaff = false;
      this.getAccountList('staff', '', this.isAvailableStaff, 1);
    }
  }

  goToDetail(type: string, role: string, param?: any): void {
    if (type === 'edit' && role === 'staff' && !this.isAvailableStaff) {
      type = 'undo';
    }
    let dialogRef = this.dialog.open(StaffDialogComponent, {
      data: {
        type: type,
        role: role,
        param: param,
      },
    });
    dialogRef.afterClosed().subscribe((data: string) => {
      if (data) {
        this.getAccountList('staff', '', this.isAvailableStaff, 1);
      }
    });
  }

  doYes(): void {
    this.haveAlertYN = false;
    this.deleteAccount();
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
    }
    this.clickId = param;
  }
}
