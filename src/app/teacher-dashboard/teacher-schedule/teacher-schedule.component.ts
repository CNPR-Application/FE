import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudentInClassComponent } from 'src/app/manager-dashboard/schedule/student-in-class/student-in-class.component';
import { LoginResponse } from 'src/interfaces/Account';
import {
  ScheduleResponse,
  ScheduleTeacherListResponse,
  ScheduleTeacherMiddle,
} from 'src/interfaces/Schedule';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';
import { TeacherScheduleClass } from './teacher-session';

@Component({
  selector: 'app-teacher-schedule',
  templateUrl: './teacher-schedule.component.html',
  styleUrls: ['./teacher-schedule.component.scss'],
})
export class TeacherScheduleComponent implements OnInit {
  //for mat calendar
  today: Date = new Date();
  startAt = new Date('2021/07/01');
  minDate = new Date('2021/07/01');
  year: any;
  dayAndDate?: string;
  selectedDate?: string;
  selectedSession?: ScheduleResponse;
  username?: string;

  //for api models
  scheduleArray?: Array<ScheduleResponse>;
  //for array of all classes in the same shift
  classSameShiftArray?: Array<TeacherScheduleClass>;
  moreRows: number = 0;

  // for loading
  isLoading: boolean = true;

  //from mon to sat
  monArray?: ScheduleTeacherMiddle;
  tueArray?: ScheduleTeacherMiddle;
  wedArray?: ScheduleTeacherMiddle;
  thuArray?: ScheduleTeacherMiddle;
  friArray?: ScheduleTeacherMiddle;
  satArray?: ScheduleTeacherMiddle;
  sunArray?: ScheduleTeacherMiddle;

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.today = new Date();
    this.onSelect(this.today);
    let user: LoginResponse = this.localStorage.get('user');
    this.username = user.username;
    this.getTeacherSchedule();
  }

  onSelect(event: any) {
    this.selectedDate = event;
    this.dayAndDate = formatDate(event, 'yyyy-MM-dd', 'en-US');
    this.getTeacherSchedule();
  }

  getTeacherSchedule(): void {
    this.isLoading = true;
    this.moreRows = 0;
    if (this.dayAndDate && this.username) {
      this.api.getTeacherSchedule(this.username, this.dayAndDate).subscribe(
        (response: ScheduleTeacherListResponse) => {
          this.classSameShiftArray = [];
          this.moreRows = 0;
          this.monArray = response.MONDAY;
          this.processClassSameShiftArray('mon', this.monArray.sessionList);
          this.tueArray = response.TUESDAY;
          this.processClassSameShiftArray('tue', this.tueArray.sessionList);
          this.wedArray = response.WEDNESDAY;
          this.processClassSameShiftArray('wed', this.wedArray.sessionList);
          this.thuArray = response.THURSDAY;
          this.processClassSameShiftArray('thu', this.thuArray.sessionList);
          this.friArray = response.FRIDAY;
          this.processClassSameShiftArray('fri', this.friArray.sessionList);
          this.satArray = response.SATURDAY;
          this.processClassSameShiftArray('sat', this.satArray.sessionList);
          this.sunArray = response.SUNDAY;
          this.processClassSameShiftArray('sun', this.sunArray.sessionList);
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

  processClassSameShiftArray(date: string, sessionList?: ScheduleResponse[]) {
    if (sessionList) {
      sessionList.forEach((x: ScheduleResponse) => {
        const classArray = this.classSameShiftArray?.find(
          (y) =>
            this.getTime(y.timeStart) == this.getTime(x.startTime) &&
            this.getTime(y.timeEnd) == this.getTime(x.endTime)
        );
        if (classArray !== undefined) {
          classArray.addToList(x, date);
        } else {
          const newClass = new TeacherScheduleClass(
            x.startTime,
            x.endTime,
            x,
            date
          );
          this.classSameShiftArray?.push(newClass);
        }
      });
    }
    if (this.classSameShiftArray && this.classSameShiftArray.length == 0) {
      this.moreRows = 2;
    } else if (
      this.classSameShiftArray &&
      this.classSameShiftArray.length == 1
    ) {
      this.moreRows = 1;
    } else if (
      this.classSameShiftArray &&
      this.classSameShiftArray.length >= 2
    ) {
      this.moreRows = 0;
    }
  }

  getTime(dateString: string): string {
    let date = new Date(dateString);
    return formatDate(date, 'HH:mm', 'en-US');
  }

  viewStudentInClass(classId: number) {
    let dialogRef = this.dialog.open(StudentInClassComponent, {
      data: { classId: classId },
    });
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
