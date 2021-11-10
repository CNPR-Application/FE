import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import {
  CreateInFoResponse,
  Guest,
  GuestArray,
  LoginResponse,
} from 'src/interfaces/Account';
import { ClassResponse, ClassArray } from 'src/interfaces/Class';
import {
  CurriculumResponse,
  CurriculumResponseArray,
} from 'src/interfaces/Curriculum';
import { ShiftArray, Shift } from 'src/interfaces/Shift';
import { SubjectArray, Subject } from 'src/interfaces/Subject';
import { Single_Chart } from 'src/interfaces/Utils';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';
import { BookingCreateComponent } from './booking-create/booking-create.component';
import { StatusDialogComponent } from './status-dialog/status-dialog.component';

@Component({
  selector: 'app-guest-booking',
  templateUrl: './guest-booking.component.html',
  styleUrls: ['./guest-booking.component.scss'],
})
export class GuestBookingComponent implements OnInit {
  constructor(
    private localStorage: LocalStorageService,
    private dialog: MatDialog,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) {}

  today?: Date;
  name?: string;
  branchId?: number;
  isLoading: boolean = false;
  isLoadingStart: boolean = false;
  curriculumList?: Array<CurriculumResponseArray>;

  //guest
  //paging
  totalPageGuest?: number;
  currentPageGuest?: number;
  pageArrayGuest?: Array<number>;
  //mutual for list
  statusGuest: string = 'pending';
  titleGuest: string = 'Đơn tư vấn mới';
  guestArray?: Array<Guest>;
  clickedIdGuest?: number;
  //search
  keyCurGuest: string = '';
  keyNameGuest: string = '';
  keyPhoneGuest: string = '';
  //form
  isDoneAccount: boolean = false;
  form = this.formBuilder.group({
    username: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    birthday: ['', Validators.required],
    role: ['student', Validators.required],
    branchId: [],
    creatingDate: [],
    parentPhone: [],
    parentName: [],
    image: [''],
  });

  ngOnInit(): void {
    this.today = new Date();
    let user: LoginResponse = this.localStorage.get('user');
    this.name = user.name;
    this.branchId = user.branchId;
    let req2 = this.api.getCurriculumByName('', true, 1, 1000).subscribe(
      (response: CurriculumResponse) => {
        this.curriculumList = response.curriculumResponseDtos;
      },
      (error) => {
        this.callAlert(
          'Ok',
          'Có lỗi xảy ra khi tải chương trình học, vui lòng thử lại'
        );
      }
    );
    let req4 = this.api.getSubjectByName('', true, 1, 1000).subscribe(
      (response: SubjectArray) => {
        this.subjectList = response.subjectsResponseDto;
        this.api.getAllShift(1, 100, true).subscribe(
          (response: ShiftArray) => {
            this.shiftList = response.shiftDtos;
          },
          (error) => {
            this.callAlert(
              'Ok',
              'Có lỗi xảy ra khi tải môn học, vui lòng thử lại',
              'close'
            );
          }
        );
      },
      (error) => {
        this.callAlert(
          'Ok',
          'Có lỗi xảy ra khi tải môn học, vui lòng thử lại',
          'close'
        );
      }
    );
    let req1 = this.getGuestByStatus(1);
    if (this.branchId) {
      let req3 = this.searchClass(
        this.subjectId,
        this.branchId,
        this.shiftId,
        this.statusClass,
        1
      );
    }
  }

  setForm(guest: Guest) {
    if (this.statusGuest === 'pending') {
      this.clickedIdGuest = guest.id;
      this.form.controls.name.setValue(guest.customerName);
      this.form.controls.phone.setValue(guest.phone);
      this.form.controls.address.setValue(guest.city);
    }
  }

  changePageGuest(pageNo: number) {
    this.getGuestByStatus(pageNo);
  }

  onChangeCurriculum(name: string) {
    this.keyCurGuest = name;
    this.searchGuest();
  }

  searchGuest() {
    if (
      this.keyCurGuest === '' &&
      this.keyNameGuest === '' &&
      this.keyPhoneGuest === ''
    ) {
      this.getGuestByStatus(1);
    } else {
      if (this.branchId) {
        this.isLoading = true;
        this.api
          .searchGuestByNamePhone(
            this.branchId,
            this.keyNameGuest,
            this.keyPhoneGuest,
            this.keyCurGuest,
            1,
            1000
          )
          .subscribe(
            (response: GuestArray) => {
              this.guestArray =
                response.registeringGuestSearchResponseDtos?.filter(
                  (x) => x.status === this.statusGuest
                );
              this.totalPageGuest = response.pageTotal;
              this.pageArrayGuest = Array(this.totalPageGuest)
                .fill(1)
                .map((x, i) => i + 1)
                .reverse();
              this.currentPageGuest = response.pageNo;
              this.isLoading = false;
            },
            (error: HttpErrorResponse) => {
              console.error(error);
              this.isLoading = false;
              this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
            }
          );
      }
    }
  }

  getGuestByStatus(pageNo: number, status?: string, titleGuest?: string) {
    if (status) {
      this.statusGuest = status;
    }
    if (titleGuest) {
      this.titleGuest = titleGuest;
    }
    if (this.branchId) {
      this.isLoading = true;
      this.form.reset();
      this.api
        .searchGuestByStatus(this.branchId, this.statusGuest, pageNo, 6)
        .subscribe(
          (response: GuestArray) => {
            this.guestArray = response.registeringGuestSearchResponseDtos;
            this.totalPageGuest = response.pageTotal;
            this.pageArrayGuest = Array(this.totalPageGuest)
              .fill(1)
              .map((x, i) => i + 1)
              .reverse();
            this.currentPageGuest = response.pageNo;
            this.isLoading = false;
          },
          (error: HttpErrorResponse) => {
            console.error(error);
            this.isLoading = false;
            this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
          }
        );
    }
  }

  editGuest(id: number, status: string, description?: string) {
    const request: Guest = {
      id: id,
      status: status,
      description: description,
    };
    this.isLoading = true;
    this.api.updateGuest(request).subscribe(
      (response: boolean) => {
        if (response) {
          this.callAlert('Ok', 'Thay đổi trạng thái khách hàng thành công');
        }
        this.getGuestByStatus(1);
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
      }
    );
  }

  //create acc for guest
  createInfo(): void {
    this.isLoading = true;
    const request: LoginResponse = {
      name: this.form.controls.name.value,
      email: this.form.controls.email.value,
      phone: this.form.controls.phone.value,
      address: this.form.controls.address.value,
      birthday: this.form.controls.birthday.value,
      image:
        'https://firebasestorage.googleapis.com/v0/b/app-test-c1bfb.appspot.com/o/ea35e7fa-19ab-4ea0-9890-5a310173d4a6.jpg?alt=media',
      branchId: this.branchId,
      parentPhone: this.form.controls.parentPhone.value,
      parentName: this.form.controls.parentName.value,
      role: 'student',
      isAvailable: true,
    };
    this.api.createInfo(request).subscribe(
      (response: CreateInFoResponse) => {
        this.isLoading = false;
        this.isDoneAccount = true;
        this.form.controls.username.setValue(response.username);
        this.callAlert('Ok', 'Tạo mới tài khoản khách hàng thành công');
        this.openBookingDialog();
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi tạo mới, vui lòng thử lại');
      }
    );
  }

  openBookingDialog(): void {
    let dialogRef = this.dialog.open(BookingCreateComponent, {
      data: {
        username: this.form.controls.username.value,
        name: this.form.controls.name.value,
        branchId: this.branchId,
        guestId: this.clickedIdGuest,
      },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.clickedIdGuest = data;
        let guest = this.guestArray?.find((g) => g.id === this.clickedIdGuest);
        if (this.clickedIdGuest) {
          this.form.reset();
          this.isDoneAccount = false;
          this.changeStatusGuest(
            this.clickedIdGuest,
            'contacted',
            guest?.description
          );
        }
      }
    });
  }

  openStatusDialog(guest: Guest) {
    let dialogRef = this.dialog.open(StatusDialogComponent, {
      data: {
        guest: guest,
      },
    });
    dialogRef.afterClosed().subscribe((data) => {
      let guestChanged: Guest = data;
      if (guestChanged.id && guestChanged.status) {
        this.changeStatusGuest(
          guestChanged.id,
          guestChanged.status,
          guestChanged.description
        );
      }
    });
  }

  changeStatusGuest(id: number, status: string, description?: string): void {
    let guest = this.guestArray?.find((g) => g.id === this.clickedIdGuest);
    if (description) {
      this.editGuest(id, status, description);
    } else {
      this.editGuest(id, status, guest?.description);
    }
  }

  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  doYes(): void {
    this.haveAlertYN = false;
    if (
      this.alertMessage === 'Bạn đã kiểm tra thông tin khách hàng kĩ rồi chứ ?'
    ) {
      this.createInfo();
    }
  }

  doNo(): void {
    this.haveAlertYN = false;
  }

  doOk(): void {
    this.haveAlertOk = false;
  }

  callAlert(type: string, message: string, param?: any) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
    }
  }

  //class opening
  classArray?: Array<ClassResponse>;
  //paging
  totalPage?: number;
  currentPage?: number;
  pageArray?: Array<number>;
  //clickId
  clickedId: number = 0;
  //for search
  statusClass: string = 'waiting';
  subjectId: number = 0;
  shiftId: number = 0;
  //dropdown
  subjectList?: Array<Subject>;
  shiftList?: Array<Shift>;

  onChangeSubject(subjectId: string) {
    this.subjectId = +subjectId;
    if (this.branchId) {
      this.searchClass(
        this.subjectId,
        this.branchId,
        this.shiftId,
        this.statusClass,
        1
      );
    }
  }

  onChangeShift(shiftId: string) {
    this.shiftId = +shiftId;
    if (this.branchId) {
      this.searchClass(
        this.subjectId,
        this.branchId,
        this.shiftId,
        this.statusClass,
        1
      );
    }
  }

  chartArray?: Array<Single_Chart>;
  colorScheme = {
    domain: ['#aaece5', '#b3d7f3', '#c3cdd7', '#ffe6b1', '#e3c5d5'],
  };
  searchClass(
    subjectId: number,
    branchId: number,
    shiftId: number,
    status: string,
    pageNo: number
  ): void {
    this.isLoadingStart = true;
    this.api
      .searchClassBySubjectAndShift(
        branchId,
        subjectId,
        shiftId,
        status,
        pageNo,
        5
      )
      .subscribe(
        (response: ClassArray) => {
          this.classArray = response.classList;
          this.chartArray = [];
          this.classArray?.forEach((y) => {
            let item: Single_Chart = {
              name: y.className,
              value: y.numberOfStudent,
            };
            this.chartArray?.push(item);
          });
          this.totalPage = response.pageTotal;
          this.pageArray = Array(this.totalPage)
            .fill(1)
            .map((x, i) => i + 1)
            .reverse();
          this.currentPage = response.pageNo;
          this.isLoadingStart = false;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.isLoadingStart = false;
          this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
        }
      );
  }

  changePage(pageNo: number) {
    if (this.branchId) {
      this.searchClass(
        this.subjectId,
        this.branchId,
        this.shiftId,
        this.statusClass,
        pageNo
      );
    }
  }
}
