import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Branch, BranchArray } from 'src/interfaces/Branch';
import { ClassArray, ClassResponse } from 'src/interfaces/Class';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-guest-schedule',
  templateUrl: './guest-schedule.component.html',
  styleUrls: ['./guest-schedule.component.scss'],
})
export class GuestScheduleComponent implements OnInit {
  constructor(private api: ApiService) {}

  //class
  totalPage?: number;
  isLoading: boolean = false;
  currentPage: number = 1;
  pageArray?: Array<number>;
  classArray?: Array<ClassResponse>;
  branchId: number = 0;
  //branch
  totalPageBranch?: number;
  isLoadingBranch: boolean = false;
  currentPageBranch: number = 1;
  pageArrayBranch?: Array<number>;
  branchArray?: Array<Branch>;
  selectedBranch?: Branch;
  //image
  imageArray: Array<string> = [
    'assets/image/building1.jpg',
    'assets/image/building2.jpg',
    'assets/image/building3.png',
    'assets/image/building4.jpg',
    'assets/image/building5.jpg',
    'assets/image/building6.jpg',
    'assets/image/building7.jpg',
    'assets/image/building9.jpg',
  ];

  imageClass: Array<string> = [
    'assets/image/cancel_class_student.png',
    'assets/image/canceled_booking.png',
    'assets/image/finished_class_student.png',
    'assets/image/finished_class_teacher.png',
    'assets/image/paid_booking.png',
    'assets/image/processed_booking.png',
    'assets/image/waiting_class_student.png',
    'assets/image/studying_class_student.png',
    'assets/image/waiting_class_teacher.png',
    'assets/image/studying_class_teacher.png',
  ]

  ngOnInit(): void {
    this.getBranchByName();
  }

  getClassAll(branchId: number): void {
    this.isLoading = true;
    this.api
      .getClassByBranch(branchId, 'waiting', this.currentPage, 13)
      .subscribe(
        (response: ClassArray) => {
          this.classArray = response.classList;
          this.totalPage = response.pageTotal;
          this.pageArray = Array(this.totalPage)
            .fill(1)
            .map((x, i) => i + 1);
          if (response.pageNo) {
            this.currentPage = response.pageNo;
          }
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.isLoading = false;
          this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
        }
      );
  }

  changePage(page: number) {
    this.currentPage = page;
    this.getClassAll(this.branchId);
  }

  getBranchByName() {
    this.isLoadingBranch = true;
    if (this.currentPage)
      this.api.getBranchByName('', this.currentPageBranch, 9, true).subscribe(
        (response: BranchArray) => {
          this.branchArray = response.branchResponseDtos;
          if (this.branchArray && this.branchArray[0].branchId) {
            this.branchId = this.branchArray[0].branchId;
            this.selectedBranch = this.branchArray[0];
            this.getClassAll(this.branchId);
          }
          this.pageArrayBranch = Array(response.pageTotal)
            .fill(1)
            .map((x, i) => i + 1);
          if (response.pageNo) this.currentPageBranch = response.pageNo;
          this.isLoadingBranch = false;
        },
        (error) => {
          console.error(error);
          this.isLoadingBranch = false;
          this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
        }
      );
  }

  changePageBranch(pageNo: number) {
    this.currentPageBranch = pageNo;
    this.getBranchByName();
  }

  chooseBranch(branch?: Branch) {
    this.selectedBranch = branch;
    if (branch?.branchId) this.branchId = branch?.branchId;
    this.getClassAll(this.branchId);
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
  }
}
