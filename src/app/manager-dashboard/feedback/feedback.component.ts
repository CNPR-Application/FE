import { Component, Input, OnInit } from '@angular/core';
import { LoginResponse } from 'src/interfaces/Account';
import { ClassArray, ClassResponse } from 'src/interfaces/Class';
import {
  FeedbackListResponse,
  FeedbackResponse,
} from 'src/interfaces/Feedback';
import { Subject, SubjectArray } from 'src/interfaces/Subject';
import { TeacherArray, TeacherInfo } from 'src/interfaces/Teacher';
import { Single_Chart } from 'src/interfaces/Utils';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  constructor(
    private localStorage: LocalStorageService,
    private api: ApiService
  ) {
    let user: LoginResponse = this.localStorage.get('user');
    this.branchId = user.branchId;
  }

  ratingArr: Array<number> = [];
  today: Date = new Date();
  branchId?: number = 0;

  //chosen class
  classId?: number;
  chosenClassName?: string = '';
  chosenClassSubject?: string = '';

  //array
  classArray?: Array<ClassResponse>;
  subjectArray?: Array<Subject>;
  teacherArray?: Array<TeacherInfo>;
  feedbackArray?: Array<FeedbackResponse>;

  //loading
  isLoadingClass: boolean = true;
  isLoadingSubject: boolean = true;
  isLoadingTeacher: boolean = true;
  isLoadingFeedback: boolean = true;

  //paging
  totalPage?: number;
  currentPage?: number;
  pageArray?: Array<number>;

  totalPageTeacher?: number;
  currentPageTeacher?: number;
  pageArrayTeacher?: Array<number>;

  //chart
  chartArray?: Array<Single_Chart>;
  chartArrayTeacher?: Array<Single_Chart>;
  colorScheme = {
    domain: ['#aaece5', '#b3d7f3', '#c3cdd7', '#ffe6b1', '#e3c5d5'],
  };

  ngOnInit(): void {
    this.getClass();
    this.getSubject(1);
    this.getTeacher(1);
    for (let i = 0; i < 5; i++) {
      this.ratingArr.push(i);
    }
  }

  showIcon(index: number, rating: number | undefined) {
    if (rating) {
      let num: number = this.toFloat(rating);
      if (num >= index + 1) {
        return '#ffd740';
      } else {
        return 'rgba(216, 216, 216, 0.41)';
      }
    }
    return 'rgba(216, 216, 216, 0.41)';
  }

  showIconString(index: number, rating: string | undefined) {
    if (rating) {
      let num: number = this.toFloat(+rating);
      if (num >= index + 1) {
        return '#ffd740';
      } else {
        return 'rgba(216, 216, 216, 0.41)';
      }
    }
    return 'rgba(216, 216, 216, 0.41)';
  }

  getClass(): void {
    this.isLoadingClass = true;
    if (this.branchId)
      this.api.getClassByBranch(this.branchId, 'finished', 1, 10000).subscribe(
        (response: ClassArray) => {
          var array = response.classList;
          this.sortUpcomingEvent(array);
          this.isLoadingClass = false;
          if (this.classArray) {
            this.classId = this.classArray[0].classId;
            this.chosenClassSubject = this.classArray[0].subjectName;
            this.chosenClassName = this.classArray[0].className;
          }
          this.getFeedback(this.classId);
        },
        (error) => {
          console.error(error);
          this.isLoadingClass = false;
          this.callAlert('Ok', 'Có lỗi xảy ra khi lớp học, vui lòng thử lại');
        }
      );
  }

  getTime(dateString: string | undefined) {
    if (dateString) {
      let date = new Date(dateString);
      return date != null ? date.getTime() : 0;
    }
    return 0;
  }

  sortUpcomingEvent(array: Array<ClassResponse> | undefined): void {
    this.classArray = array;
    if (this.classArray)
      this.classArray.sort((a: ClassResponse, b: ClassResponse) => {
        return this.getTime(b.openingDate) - this.getTime(a.openingDate);
      });
  }

  chooseClass(index: number, classId: number | undefined) {
    this.classId = classId;
    if (this.classArray) {
      this.chosenClassName = this.classArray[index].className;
      this.chosenClassSubject = this.classArray[index].subjectName;
      this.getFeedback(classId);
    }
  }

  getSubject(pageNo: number): void {
    this.isLoadingSubject = true;
    this.api.getSubjectByName('', true, pageNo, 5).subscribe(
      (response: SubjectArray) => {
        this.subjectArray = response.subjectsResponseDtos;
        this.subjectArray = this.subjectArray?.sort(
          (a, b) => this.toFloat(b.rating) - this.toFloat(a.rating)
        );
        this.totalPage = response.pageTotal;
        this.pageArray = Array(this.totalPage)
          .fill(1)
          .map((x, i) => i + 1)
          .reverse();
        this.currentPage = response.pageNo;
        this.chartArray = [];
        this.subjectArray?.forEach((y) => {
          if (y && y.rating) {
            let num = this.toFloat(y.rating);
            let item: Single_Chart = {
              name: y.subjectName,
              value: num,
            };
            this.chartArray?.push(item);
          }
        });
        this.chartArray = this.chartArray.slice(0, 10);
        this.isLoadingSubject = false;
      },
      (error) => {
        console.error(error);
        this.isLoadingSubject = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi môn học, vui lòng thử lại');
      }
    );
  }

  toFloat(x: number): number {
    let string = '' + x;
    string.replace(',', '.');
    return Math.floor(parseFloat(string));
  }

  changePageSubject(pageNo: number) {
    this.currentPage = pageNo;
    this.getSubject(this.currentPage);
  }

  changePageTeacher(pageNo: number) {
    this.currentPageTeacher = pageNo;
    this.getTeacher(this.currentPageTeacher);
  }

  getTeacher(pageNo: number): void {
    this.isLoadingTeacher = true;
    if (this.branchId)
      this.api.searchTeacher(this.branchId, 0, pageNo, 5).subscribe(
        (response: TeacherArray) => {
          this.teacherArray = response.teacherList;
          this.teacherArray = this.teacherArray?.sort(
            (a, b) => this.toFloat(b.rating) - this.toFloat(a.rating)
          );
          this.totalPageTeacher = response.totalPage;
          this.pageArrayTeacher = Array(this.totalPageTeacher)
            .fill(1)
            .map((x, i) => i + 1)
            .reverse();
          this.currentPageTeacher = response.pageNo;
          this.chartArrayTeacher = [];
          this.teacherArray?.forEach((y) => {
            if (y && y.rating) {
              let num = this.toFloat(y.rating);
              let item: Single_Chart = {
                name: y.name,
                value: num,
              };
              this.chartArrayTeacher?.push(item);
            }
          });
          this.chartArrayTeacher = this.chartArrayTeacher.slice(0, 10);
          this.isLoadingTeacher = false;
        },
        (error) => {
          console.error(error);
          this.isLoadingTeacher = false;
          this.callAlert('Ok', 'Có lỗi xảy ra khi giáo viên, vui lòng thử lại');
        }
      );
  }

  getFeedback(classId: number | undefined): void {
    this.isLoadingFeedback = true;
    if (classId)
      this.api.getFeedbackByClassId(classId, 1, 10000).subscribe(
        (response: FeedbackListResponse) => {
          this.feedbackArray = response.feedbackList;
          this.isLoadingFeedback = false;
        },
        (error) => {
          console.error(error);
          this.isLoadingFeedback = false;
          this.callAlert('Ok', 'Có lỗi xảy ra khi feedbacks, vui lòng thử lại');
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
