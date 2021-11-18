import { Component, OnInit } from '@angular/core';
import { LoginResponse } from 'src/interfaces/Account';
import { ClassStatus } from 'src/interfaces/Class';
import { SubjectInTeacher } from 'src/interfaces/Teacher';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';

@Component({
  selector: 'app-main-teacher',
  templateUrl: './main-teacher.component.html',
  styleUrls: ['./main-teacher.component.scss'],
})
export class MainTeacherComponent implements OnInit {
  constructor(
    private api: ApiService,
    private localStorageService: LocalStorageService
  ) {}

  ratingArr: Array<number> = [];
  rating: number = 3;
  info?: LoginResponse;
  url?: string;
  // for alert, loading
  isLoadingSubject: boolean = false;
  isLoading: boolean = false;
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  //subject
  subjectList?: Array<SubjectInTeacher>;

  today = new Date();
  teachingClass: number = 0;
  finishedClass: number = 0;
  teachingClassEnd?: number;
  finishedClassEnd?: number;

  ngOnInit(): void {
    this.info = this.localStorageService.get('user');
    this.url = this.info?.image;
    this.getListTeachingSubject();
    this.getStatistic();
    if (this.info?.rating) {
      this.rating = this.getRating(this.info?.rating);
    }
    this.ratingArr = [];
    for (let i = 0; i < 5; i++) {
      this.ratingArr.push(i);
    }
  }

  teachingClassStop: any = setInterval(() => {
    if (this.teachingClassEnd) {
      this.teachingClass++;
      if (this.teachingClass == this.teachingClassEnd) {
        clearInterval(this.teachingClassStop);
      }
    }
  }, 150);

  finishedClassStop: any = setInterval(() => {
    if (this.finishedClassEnd) {
      this.finishedClass++;
      if (this.finishedClass == this.finishedClassEnd) {
        clearInterval(this.finishedClassStop);
      }
    }
  }, 150);

  getRating(ratingString: string): number {
    let temp = ratingString.split('/');
    let n1: number = +temp[0];
    let n2: number = +temp[1];
    return n1 / n2;
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return '#ffd740';
    } else {
      return 'rgba(216, 216, 216, 0.41)';
    }
  }

  getListTeachingSubject(): void {
    this.isLoadingSubject = true;
    if (this.info?.username)
      this.api
        .searchTeachingSubjectByTeacherUsername(this.info?.username)
        .subscribe(
          (response: SubjectInTeacher[]) => {
            this.subjectList = response;
            this.isLoadingSubject = false;
          },
          (error) => {
            this.isLoadingSubject = false;
            this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
          }
        );
  }

  getStatistic(): void {
    this.isLoading = true;
    if (this.info?.username)
      this.api.getTeacherClassStatistic(this.info?.username).subscribe(
        (response: ClassStatus) => {
          this.teachingClassEnd = response.studyingClass;
          this.finishedClassEnd = response.finishedClass;
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
        }
      );
  }

  callAlert(type: string, message: string, param?: any) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
    }
  }

  doYes(): void {
    this.haveAlertYN = false;
  }

  doNo(): void {
    this.haveAlertYN = false;
  }

  doOk(): void {
    this.haveAlertOk = false;
  }
}
