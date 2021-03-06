import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ClassResponse } from 'src/interfaces/Class';
import { NotiClassRequest } from 'src/interfaces/Notification';
import { SessionList, SessionResponse } from 'src/interfaces/Session';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';
import { TimeService } from 'src/service/time.service';
import { SessionDialogComponent } from './session-dialog/session-dialog.component';

@Component({
  selector: 'app-session-management',
  templateUrl: './session-management.component.html',
  styleUrls: ['./session-management.component.scss'],
})
export class SessionManagementComponent implements OnInit {
  constructor(
    private localStorage: LocalStorageService,
    private dialog: MatDialog,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private timeService: TimeService
  ) {}

  today = new Date();
  classModel?: ClassResponse;
  isLoading: boolean = false;
  sessionArray?: Array<SessionResponse>;
  clickedSession?: SessionResponse;
  clickedId: number = 0;
  //form
  form: FormGroup = this.formBuilder.group({
    teacherName: [''],
    roomName: [''],
    date: [''],
    startTime: [''],
    endTime: [''],
  });
  startTime?: string;
  date?: string;
  endTime?: string;
  //point
  midpoint1: number = 0;
  midpoint2: number = 0;
  midpoint3: number = 0;
  //
  isEdit: boolean = false;

  ngOnInit(): void {
    this.classModel = this.localStorage.get('class');
    this.getSession();
  }

  getSession(): void {
    this.isLoading = true;
    if (this.classModel?.classId) {
      this.api.getSessionInClass(this.classModel.classId, 1, 1000).subscribe(
        (response: SessionList) => {
          this.sessionArray = response.sessionList;
          if (this.sessionArray) {
            this.midpoint1 = Math.ceil(this.sessionArray?.length / 3);
            this.midpoint2 = this.midpoint1 * 2;
            this.midpoint3 = this.sessionArray.length;
          }
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
          this.callAlert(
            'Ok',
            'C?? l???i x???y ra khi t???i c??c bu???i h???c, vui l??ng th??? l???i'
          );
        }
      );
    }
  }

  setForm(session: SessionResponse) {
    this.clickedSession = session;
    this.clickedId = session.sessionId;
    this.form.controls.teacherName.setValue(this.clickedSession.teacherName);
    this.form.controls.roomName.setValue(this.clickedSession.roomName);
    this.startTime = session.startTime;
    this.date = session.startTime;
    this.endTime = session.endTime;
    this.isEdit =
      this.timeService.checkInThePast(session.startTime, session.endTime) ===
      'Trong t????ng lai';
  }

  resetForm() {
    this.startTime = undefined;
    this.date = undefined;
    this.endTime = undefined;
    this.clickedSession = undefined;
    this.clickedId = 0;
    this.isEdit = false;
    this.form.reset();
  }

  openDialog() {
    let dialogRef = this.dialog.open(SessionDialogComponent, {
      data: {
        class: this.classModel,
        session: this.clickedSession,
      },
    });
    dialogRef.afterClosed().subscribe((data: boolean) => {
      if (data) {
        this.getSession();
        let request: NotiClassRequest = {
          classId: this.classModel?.classId,
          senderUsername: 'system',
          title: 'Thay ?????i l???ch h???c l???p ' + this.classModel?.className,
          body:
            'L???ch h???c c???a l???p ' +
            this.classModel?.className +
            ' v???a thay ?????i. Vui l??ng xem l???ch chi ti???t ????? bi???t th??m th??ng tin, trung t??m CNPR ch??n th??nh c??m ??n !',
        };
        this.api.createNotiForClass(request).subscribe((response) => {
          console.log('K???t qu??? g???i th??ng b??o session: ' + response);
        });
        this.resetForm();
      }
    });
  }

  // alert
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  doYes(): void {
    this.haveAlertYN = false;
  }

  doNo(): void {
    this.haveAlertYN = false;
  }

  doOk(): void {
    this.haveAlertOk = false;
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
