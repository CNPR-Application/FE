import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  CurriculumResponseArray,
  CurriculumResponse,
} from 'src/interfaces/Curriculum';
import {
  Subject,
  SubjectArray,
  SubjectDetail,
  SubjectDetailArray,
} from 'src/interfaces/Subject';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-guest-course',
  templateUrl: './guest-course.component.html',
  styleUrls: ['./guest-course.component.scss'],
})
export class GuestCourseComponent implements OnInit {
  constructor(
    private service: ApiService,
    private viewportScroller: ViewportScroller
  ) {}

  curriculumArray: Array<CurriculumResponseArray> | undefined;
  totalPage?: number;
  currentPage: number = 1;
  pageArray?: Array<number>;
  isLoading: boolean = true;
  clickedCurriculum?: CurriculumResponseArray;

  subjectArray?: Array<Subject>;
  totalPageSubject?: number;
  currentPageSubject: number = 1;
  pageArraySubject?: Array<number>;
  clickedSubject?: Subject;
  isLoadingSubject: boolean = true;

  subjectDetailArray: Array<SubjectDetail> | undefined;
  isLoadingSubjectDetail: boolean = true;

  //image
  imageClass: Array<string> = [
    'assets/image/cancel_class_student.png',
    'assets/image/processed_booking.png',
    'assets/image/studying_class_student.png',
    'assets/image/studying_class_teacher.png',
  ];

  colorArray: Array<string> = [
    '#3a86ff',
    '#ffbe0b',
    '#8338ec',
    '#fb5607',
    '#ff006e',
  ];

  ngOnInit(): void {
    this.getCurriculum();
  }

  getCurriculum(): void {
    this.isLoading = true;
    this.service.getCurriculumByName('', true, this.currentPage, 4).subscribe(
      (response: CurriculumResponse) => {
        this.curriculumArray = response.curriculumResponseDtos;
        this.totalPage = response.totalPage;
        this.currentPage = response.pageNo;
        this.pageArray = Array(response.totalPage)
          .fill(1)
          .map((x, i) => i + 1);
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
      }
    );
  }

  getSubject(): void {
    this.isLoadingSubject = true;
    if (this.clickedCurriculum?.curriculumId)
      this.service
        .getSubjectByCurriculumId(
          this.clickedCurriculum?.curriculumId,
          true,
          this.currentPageSubject,
          5
        )
        .subscribe(
          (response: SubjectArray) => {
            this.subjectArray = [];
            this.subjectArray = response.subjectsResponseDto;
            this.totalPageSubject = response.totalPage;
            this.currentPageSubject = response.pageNo;
            this.pageArraySubject = Array(response.totalPage)
              .fill(1)
              .map((x, i) => i + 1);
            this.viewportScroller.scrollToAnchor('sub');
            this.isLoadingSubject = false;
          },
          (error) => {
            console.error(error);
            this.isLoadingSubject = false;
            this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
          }
        );
  }

  getSubjectDetail(): void {
    this.isLoadingSubjectDetail = true;
    if (this.clickedSubject?.subjectId)
      this.service
        .getSubjectDetailBySubjectId(
          this.clickedSubject?.subjectId,
          true,
          1,
          500
        )
        .subscribe(
          (response: SubjectDetailArray) => {
            this.subjectDetailArray = response.subjectDetailDtoList;
            this.isLoadingSubjectDetail = false;
          },
          (error) => {
            console.error(error);
            this.isLoadingSubjectDetail = false;
            this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
          }
        );
  }

  changePage(pageNo: number) {
    this.currentPage = pageNo;
    this.getCurriculum();
  }

  changePageSubject(pageNo: number) {
    this.currentPageSubject = pageNo;
    this.getSubject();
  }

  clickCurri(curriculum?: CurriculumResponseArray) {
    if (curriculum) {
      this.clickedCurriculum = curriculum;
      this.getSubject();
    }
  }

  clickSub(subject?: Subject) {
    if (subject) {
      this.clickedSubject = subject;
      this.getSubjectDetail();
    }
  }

  //alert
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
