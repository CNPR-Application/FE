import { Component, OnInit } from '@angular/core';
import {
  Subject,
  SubjectDetail,
  SubjectDetailArray,
} from 'src/interfaces/Subject';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';

@Component({
  selector: 'app-teacher-subject',
  templateUrl: './teacher-subject.component.html',
  styleUrls: ['./teacher-subject.component.scss'],
})
export class TeacherSubjectComponent implements OnInit {
  constructor(
    private localService: LocalStorageService,
    private api: ApiService
  ) {}

  // for alert, loading
  isLoading: boolean = false;
  isLoadingDetail: boolean = false;
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  today = new Date();
  username?: string;
  currentPage: number = 1;

  //array
  subjectArray?: Array<Subject>;
  pageArray?: Array<number>;
  subjectDetailArray?: Array<SubjectDetail>;
  moreRowArray?: Array<number>;

  clickedId?: number;

  ngOnInit(): void {
    let user = this.localService.get('user');
    this.username = user.username;
    this.getSubject();
  }

  getSubject(): void {
    this.isLoading = true;
    if (this.username) {
      this.api
        .getSubjectOfTeacher(this.username, this.currentPage, 15)
        .subscribe(
          (response) => {
            this.subjectArray = response.subjectList;
            this.currentPage = response.pageNo;
            this.clickedId = undefined;
            this.pageArray = Array(response.totalPage)
              .fill(1)
              .map((x, i) => i + 1)
              .reverse();
            this.moreRowArray = [];
            if (this.subjectArray) {
              let moreRow: number = 8 - this.subjectArray?.length;
              while (moreRow >= 1) {
                this.moreRowArray?.push(moreRow);
                moreRow--;
              }
            }
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

  goToDetailSubject(subjectId?: number) {
    this.clickedId = subjectId;
    if (subjectId) {
      this.isLoadingDetail = true;
      this.api.getSubjectDetailBySubjectId(subjectId, true, 1, 100).subscribe(
        (response: SubjectDetailArray) => {
          this.subjectDetailArray = response.subjectDetailDtoList;
          if (this.subjectDetailArray) {
            this.subjectDetailArray.sort(
              (a: SubjectDetail, b: SubjectDetail) => a.weekNum - b.weekNum
            );
          }
          this.isLoadingDetail = false;
        },
        (error) => {
          console.error(error);
          this.isLoadingDetail = false;
          this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
        }
      );
    }
  }

  changePage(pageNo: number) {
    this.currentPage = pageNo;
    this.getSubject();
  }

  callAlert(type: string, message: string) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
    }
  }
}
