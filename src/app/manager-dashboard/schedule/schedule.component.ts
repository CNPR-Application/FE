import { Component, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { formatDate } from '@angular/common';
import {
  ScheduleListResponse,
  ScheduleResponse,
} from 'src/app/interfaces/Schedule';
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

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.today = new Date();
    this.onSelect(this.today);
  }

  onSelect(event: any) {
    this.selectedDate = event;
    this.dayAndDate = formatDate(event, 'yyyy-MM-dd', 'en-US');
    this.getSchedule();
  }

  getSchedule(): void {
    this.isLoading = true;
    this.moreRows = 0;
    if (this.dayAndDate) {
      this.api.getSchedule(this.dayAndDate).subscribe(
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
          if (this.classSameShiftArray.length < 2) {
            this.moreRows = 2;
          } else if (this.classSameShiftArray.length < 3) {
            this.moreRows = 1;
          }
          this.isLoading = false;
          this.upcomingSession = [];
          this.scheduleArray?.forEach((x) => {
            let newDate = new Date(x.startTime);
            let now = new Date();
            if (newDate.getTime() >= now.getTime()) {
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
