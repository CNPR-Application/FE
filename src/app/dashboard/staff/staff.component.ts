import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAccountList('manager', '', true, 1);
  }

  clickId?: LoginResponse;
  isLoading: boolean = true;
  isManager: boolean = true;

  //alert
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  //manager
  keyManager: string = '';
  isAvailableManager: boolean = true;
  managerResponse?: InfoArray;
  managerArray: Array<LoginResponse> | undefined;
  totalManagerPage?: number;
  currentManagerPage?: number;
  pageManagerArray?: Array<number>;

  //staff
  keyStaff: string = '';
  isAvailableStaff: boolean = true;
  staffResponse?: InfoArray;
  staffArray: Array<LoginResponse> | undefined;
  totalStaffPage?: number;
  currentStaffPage?: number;
  pageStaffArray?: Array<number>;

  viewManager() {
    if (!this.isManager) {
      this.isManager = true;
      this.getAccountList('manager', '', true, 1);
      this.isAvailableManager = true;
    }
  }

  viewStaff() {
    if (this.isManager) {
      this.isManager = false;
      this.getAccountList('staff', '', true, 1);
      this.isAvailableStaff = true;
    }
  }

  getAccountList(
    role: string,
    username: string,
    isAvailable: boolean,
    pageNo: number
  ) {
    this.isLoading = true;
    if (role === 'manager') {
      this.api
        .searchInfoByUsername('manager', username, isAvailable, pageNo, 10)
        .subscribe(
          (response: InfoArray) => {
            this.managerResponse = response;
            this.managerArray = this.managerResponse.accountResponseDtoList;
            this.totalManagerPage = this.managerResponse.totalPage;
            this.currentManagerPage = this.managerResponse.pageNo;
            this.pageManagerArray = Array(this.totalManagerPage)
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
    } else if (role === 'staff') {
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
            this.callAlert('Ok', 'Không thể xóa người này. Vui lòng thử lại');
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

  searchManager(): void {
    this.getAccountList('manager', this.keyManager, this.isAvailableManager, 1);
  }

  createManager(): void {
    this.goToDetail('create', 'manager');
  }

  changePageManager(page: number): void {
    this.getAccountList(
      'manager',
      this.keyManager,
      this.isAvailableManager,
      page
    );
  }

  viewCurrentManager(): void {
    if (!this.isAvailableManager) {
      this.isAvailableManager = true;
      this.getAccountList('manager', '', this.isAvailableManager, 1);
    }
  }

  viewDeletedManager(): void {
    if (this.isAvailableManager) {
      this.isAvailableManager = false;
      this.getAccountList('manager', '', this.isAvailableManager, 1);
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
    if (type === 'edit' && role === 'manager' && !this.isAvailableManager) {
      type = 'undo';
    }
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
        if (this.isManager) {
          this.getAccountList('manager', '', this.isAvailableManager, 1);
        } else {
          this.getAccountList('staff', '', this.isAvailableStaff, 1);
        }
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
