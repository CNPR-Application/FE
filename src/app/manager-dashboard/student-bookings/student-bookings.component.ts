import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginResponse } from 'src/interfaces/Account';
import { Booking, BookingArray } from 'src/interfaces/Booking';
import { StudentResponse } from 'src/interfaces/Student';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';
import { BookingCreateComponent } from '../guest-booking/booking-create/booking-create.component';
import { BookingStatusComponent } from './booking-status/booking-status.component';

@Component({
  selector: 'app-student-bookings',
  templateUrl: './student-bookings.component.html',
  styleUrls: ['./student-bookings.component.scss'],
})
export class StudentBookingsComponent implements OnInit {
  constructor(
    private localStorage: LocalStorageService,
    private dialog: MatDialog,
    private api: ApiService
  ) {}

  today?: Date;
  listTitle: string = 'Danh sách đơn đăng ký mới';
  isLoading: boolean = true;
  bookingArray?: Array<Booking>;
  displayArray?: Array<Booking>;
  //paging
  totalPage?: number;
  currentPage?: number;
  pageArray?: Array<number>;
  //clickId
  clickedId: number = 0;
  //for search
  status: string = 'paid';
  student?: StudentResponse;
  url?: string;
  username?: string;
  payingDate?: string;

  ngOnInit(): void {
    this.today = new Date();
    let message = this.localStorage.get('message');
    if (message === 'viewStudentBooking') {
      this.student = this.localStorage.get('data');
      this.url = this.student?.image;
      this.username = this.student?.username;
      this.getBookingAll();
    }
  }

  changeTitle(name: string): void {
    this.listTitle = name;
    if (name === 'Danh sách đơn đăng ký mới') {
      this.status = 'paid';
    } else if (name === 'Danh sách đơn đăng ký đã xử lý') {
      this.status = 'processed';
    } else if (name === 'Danh sách đơn đăng ký đã hủy') {
      this.status = 'canceled';
    }
    if (this.username) this.getBookingByStatus();
  }

  getBookingByStatus(): void {
    this.displayArray = this.bookingArray?.filter(
      (x) => x.status === this.status
    );
    if (this.displayArray) {
      this.totalPage = 1;
      this.pageArray = Array(this.totalPage)
        .fill(1)
        .map((x, i) => i + 1)
        .reverse();
      this.currentPage = 1;
    }
  }

  getBookingAll(): void {
    this.isLoading = true;
    if (this.username)
      this.api
        .searchBookingByStudentUsername(this.username, 1, 1000000)
        .subscribe(
          (response: BookingArray) => {
            this.bookingArray = response.classList;
            this.getBookingByStatus();
            this.isLoading = false;
          },
          (error: HttpErrorResponse) => {
            console.error(error);
            this.isLoading = false;
            this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
          }
        );
  }

  changePage(pageNo: number) {}

  openCreateDialog() {
    let user: LoginResponse = this.localStorage.get('user');
    let dialogRef = this.dialog.open(BookingCreateComponent, {
      data: {
        username: this.student?.username,
        name: this.student?.name,
        branchId: user.branchId,
      },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.getBookingAll();
      }
    });
  }

  openStatusDialog(booking: Booking) {
    let dialogRef = this.dialog.open(BookingStatusComponent, {
      data: {
        booking: booking,
      },
    });
    dialogRef.afterClosed().subscribe((data) => {
      let booking: Booking = data;
      if (booking) {
        this.changeStatusBooking(booking);
      }
    });
  }

  changeStatusBooking(booking: Booking) {
    this.isLoading = true;
    this.api.updateBooking(booking).subscribe(
      (response: boolean) => {
        this.isLoading = false;
        if (response) {
          this.callAlert('Ok', 'Chỉnh sửa thành công');
          this.getBookingAll();
        } else {
          this.callAlert('Ok', 'Có lỗi xảy ra khi chỉnh sửa, vui lòng thử lại');
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi chỉnh sửa, vui lòng thử lại');
      }
    );
  }

  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  doYes(): void {
    this.haveAlertYN = false;
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
    this.clickedId = param;
  }
}
