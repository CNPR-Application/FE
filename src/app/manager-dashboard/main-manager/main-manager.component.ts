import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoginResponse } from 'src/interfaces/Account';
import { ClassResponse, ClassArray } from 'src/interfaces/Class';
import { ShiftArray, Shift } from 'src/interfaces/Shift';
import { SubjectArray, Subject } from 'src/interfaces/Subject';
import { Single_Chart } from 'src/interfaces/Utils';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';

@Component({
  selector: 'app-main-manager',
  templateUrl: './main-manager.component.html',
  styleUrls: ['./main-manager.component.scss'],
})
export class MainManagerComponent implements OnInit {
  constructor(
    private localStorage: LocalStorageService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    let user: LoginResponse = this.localStorage.get('user');
    this.branchId = user.branchId;
    this.api.getSubjectByName('', true, 1, 1000).subscribe(
      (response: SubjectArray) => {
        this.subjectList = response.subjectsResponseDto;
        this.api.getAllShift(1, 100, true).subscribe(
          (response: ShiftArray) => {
            this.shiftList = response.shiftDtos;
          },
          (error) => {
            this.callAlert(
              'Ok',
              'Có lỗi xảy ra khi tải ca học, vui lòng thử lại',
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
    if (this.branchId) {
      this.searchClass(
        this.subjectId,
        this.branchId,
        this.shiftId,
        'waiting',
        1
      );
    }
  }

  chartArray?: Array<Single_Chart>;
  colorScheme = {
    domain: ['#aaece5', '#b3d7f3', '#c3cdd7', '#ffe6b1', '#e3c5d5'],
  };

  //class opening
  classArray?: Array<ClassResponse>;
  //paging
  totalPage?: number;
  currentPage?: number;
  pageArray?: Array<number>;

  //for search
  statusClass: string = 'waiting';
  subjectId: number = 0;
  shiftId: number = 0;
  //dropdown
  subjectList?: Array<Subject>;
  shiftList?: Array<Shift>;

  branchId?: number;
  isLoadingStart: boolean = false;
  today = new Date();

  single = [
    {
      name: 'Đơn Tư Vấn Mới',
      value: 8940000,
    },
    {
      name: 'Bookings Mới',
      value: 5000000,
    },
    {
      name: 'Học Sinh Mới',
      value: 7200000,
    },
    {
      name: 'Lớp Học Mới',
      value: 5200000,
    }
  ];

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
        1000
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
          this.totalPage = response.totalPage;
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

  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

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
}
