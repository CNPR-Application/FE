import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Branch, BranchArray } from 'src/interfaces/Branch';
import { ClassArray, ClassResponse } from 'src/interfaces/Class';
import { Shift, ShiftArray } from 'src/interfaces/Shift';
import { Subject, SubjectArray } from 'src/interfaces/Subject';
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
  ];

  //search
  shiftId: number = 0;
  subjectId: number = 0;
  subjectList?: Array<Subject>;
  shiftList?: Array<Shift>;

  ngOnInit(): void {
    this.getBranchByName();
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
              'Có lỗi xảy ra khi tải ca học, vui lòng thử lại'
            );
          }
        );
      },
      (error) => {
        this.callAlert('Ok', 'Có lỗi xảy ra khi tải môn học, vui lòng thử lại');
      }
    );
  }

  getClassAll(branchId: number): void {
    this.isLoading = true;
    this.api
      .getClassByBranch(branchId, 'waiting', this.currentPage, 13)
      .subscribe(
        (response: ClassArray) => {
          this.classArray = response.classList;
          this.totalPage = response.totalPage;
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
    this.searchClass(this.subjectId, this.branchId, this.shiftId);
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
          this.pageArrayBranch = Array(response.totalPage)
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

  onChangeSubject(subjectId: string) {
    this.subjectId = +subjectId;
    this.searchClass(this.subjectId, this.branchId, this.shiftId);
  }

  onChangeShift(shiftId: string) {
    this.shiftId = +shiftId;
    this.searchClass(this.subjectId, this.branchId, this.shiftId);
  }

  searchClass(subjectId: number, branchId: number, shiftId: number): void {
    this.isLoading = true;
    this.api
      .searchClassBySubjectAndShift(
        branchId,
        subjectId,
        shiftId,
        'waiting',
        this.currentPage,
        13
      )
      .subscribe(
        (response: ClassArray) => {
          this.classArray = response.classList;
          this.totalPage = response.totalPage;
          this.pageArray = Array(this.totalPage)
            .fill(1)
            .map((x, i) => i + 1);
          this.currentPage = response.pageNo;
          this.isLoading = false;
          this.subjectId = subjectId;
          this.subjectId = shiftId;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.isLoading = false;
          this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
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
  }
}
