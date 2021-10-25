import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ClassArray, ClassResponse } from 'src/interfaces/Class';
import { TeacherInfo } from 'src/interfaces/Teacher';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';

@Component({
  selector: 'app-teacher-class',
  templateUrl: './teacher-class.component.html',
  styleUrls: ['./teacher-class.component.scss'],
})
export class TeacherClassComponent implements OnInit {
  constructor(
    private localStorage: LocalStorageService,
    private api: ApiService
  ) {}

  today?: Date;
  listTitle: string = 'Danh sách lớp chờ khai giảng';
  isLoading: boolean = true;
  classArray?: Array<ClassResponse>;
  //paging
  totalPage?: number;
  currentPage?: number;
  pageArray?: Array<number>;
  //clickId
  clickedId: number = 0;
  //for search
  status: string = 'waiting';
  //
  teacher?: TeacherInfo;
  url?: string;
  username?: string;
  openingDate?: string;

  ngOnInit(): void {
    this.today = new Date();
    let message = this.localStorage.get('message');
    if (message === 'viewTeacherClass') {
      this.teacher = this.localStorage.get('data');
      this.url = this.teacher?.teacherImage;
      this.username = this.teacher?.teacherUsername;
      if (this.username) this.getClassAll(this.username, this.status, 1);
    }
  }

  changeTitle(name: string): void {
    this.listTitle = name;
    if (name === 'Danh sách lớp chờ khai giảng') {
      this.status = 'waiting';
    } else if (name === 'Danh sách lớp đang dạy') {
      this.status = 'studying';
    } else if (name === 'Danh sách lớp đã kết thúc') {
      this.status = 'finished';
    }
    if (this.username) this.getClassAll(this.username, this.status, 1);
  }

  getClassAll(username: string, status: string, pageNo: number): void {
    this.isLoading = true;
    this.api
      .searchClassByTeacherUsernameAndStatus(username, status, pageNo, 13)
      .subscribe(
        (response: ClassArray) => {
          this.classArray = response.classList;
          this.totalPage = response.pageTotal;
          this.pageArray = Array(this.totalPage)
            .fill(1)
            .map((x, i) => i + 1)
            .reverse();
          this.currentPage = response.pageNo;
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.isLoading = false;
          this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
        }
      );
  }

  changePage(pageNo: number) {
    if (this.username) this.getClassAll(this.username, this.status, pageNo);
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
