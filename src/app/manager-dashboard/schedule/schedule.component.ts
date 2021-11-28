import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginResponse } from 'src/interfaces/Account';
import {
  ScheduleListResponse,
  ScheduleResponse,
} from 'src/interfaces/Schedule';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';
import { TimeService } from 'src/service/time.service';
import { ScheduleClass } from './session';
import { StudentInClassComponent } from './student-in-class/student-in-class.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  //for mat calendar
  today: Date = new Date();
  startAt = new Date('2021/07/01');
  minDate = new Date('2021/07/01');
  year: any;
  dayAndDate?: string;
  selectedDate?: string;

  //for api models
  scheduleArray?: Array<ScheduleResponse>;
  //for array of all classes in the same shift
  classSameShiftArray?: Array<ScheduleClass>;
  moreRows: number = 0;

  // for loading
  isLoading: boolean = true;

  //for upcoming session
  upcomingSession?: Array<ScheduleResponse>;

  //branch
  branchId?: number;

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private timeService: TimeService,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.today = new Date();
    let user: LoginResponse = this.localStorage.get('user');
    this.branchId = user.branchId;
    this.onSelect(this.today);
  }

  onSelect(event: any) {
    this.selectedDate = event;
    this.dayAndDate = formatDate(event, 'yyyy-MM-dd', 'en-US');
    this.getSchedule();
  }

  getSchedule(): void {
    this.moreRows = 0;
    if (this.dayAndDate && this.branchId) {
      this.isLoading = true;
      this.api.getSchedule(this.branchId, this.dayAndDate).subscribe(
        (response: ScheduleListResponse) => {
          this.scheduleArray = response.sessionList;
          this.classSameShiftArray = [];
          this.scheduleArray?.forEach((x) => {
            const classArray = this.classSameShiftArray?.find(
              (y) => y.timeStart == x.startTime && y.timeEnd == x.endTime
            );
            if (classArray !== undefined) {
              classArray.addToList(x);
            } else {
              const newClass = new ScheduleClass(x.startTime, x.endTime, x);
              this.classSameShiftArray?.push(newClass);
            }
          });
          if (this.classSameShiftArray.length == 0) {
            this.moreRows = 2;
          } else if (this.classSameShiftArray.length <= 2) {
            this.moreRows = 1;
          }
          this.isLoading = false;
          this.upcomingSession = [];
          this.scheduleArray?.forEach((x) => {
            let newDate = this.timeService.convertTimeFromApi(x.startTime);
            let now = new Date();
            if (newDate >= now.getTime()) {
              this.upcomingSession?.push(x);
            }
          });
          this.sortUpcomingEvent();
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
          this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
        }
      );
    }
  }

  getTime(dateString: string) {
    let date = new Date(dateString);
    return date != null ? date.getTime() : 0;
  }

  sortUpcomingEvent(): void {
    if (this.upcomingSession) {
      this.upcomingSession.sort((a: ScheduleResponse, b: ScheduleResponse) => {
        return this.getTime(a.startTime) - this.getTime(b.startTime);
      });
    }
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
