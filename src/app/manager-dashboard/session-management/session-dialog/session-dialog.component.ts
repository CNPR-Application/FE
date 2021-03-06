import { DatePipe, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClassResponse } from 'src/interfaces/Class';
import { RoomResponse } from 'src/interfaces/Room';
import { SessionRequest, SessionResponse } from 'src/interfaces/Session';
import { TeacherInfo, TeacherSearchArray } from 'src/interfaces/Teacher';
import { ApiService } from 'src/service/api.service';
import { TimeService } from 'src/service/time.service';

@Component({
  selector: 'app-session-dialog',
  templateUrl: './session-dialog.component.html',
  styleUrls: ['./session-dialog.component.scss'],
})
export class SessionDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SessionDialogComponent>,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private datepipe: DatePipe,
    private timeService: TimeService
  ) {}

  // for alert, loading
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  isLoading: boolean = false;

  //form
  form = this.formBuilder.group({
    newTeacherId: [null, Validators.required],
    changeAllTeacher: [false, Validators.required],
    newRoomId: [null, Validators.required],
    changeAllRoom: [false, Validators.required],
    newStartTime: [null, Validators.required],
    changeAllTime: [false, Validators.required],
  });

  //array
  teacherArray?: Array<TeacherInfo>;
  roomArray?: Array<RoomResponse>;

  //model
  branchId?: number;
  classModel?: ClassResponse;
  sessionModel?: SessionResponse;
  today = new Date();
  startTime?: string;
  isSuccess: boolean = false;
  todayDate?: string;

  ngOnInit(): void {
    this.classModel = this.data.class;
    this.sessionModel = this.data.session;
    this.branchId = this.classModel?.branchId;
    if (this.sessionModel?.startTime) {
      this.startTime = formatDate(
        this.timeService.convertTimeFromApi(this.sessionModel?.startTime),
        'yyyy-MM-dd HH:mm',
        'en-US'
      );
    }
    this.form.controls.newRoomId.setValue(this.sessionModel?.roomId);
    this.form.controls.newTeacherId.setValue(this.sessionModel?.teacherId);
    this.form.controls.newStartTime.setValue(this.startTime);
    this.todayDate = formatDate(this.today, 'yyyy-MM-dd', 'en-US') + 'T00:00';
    this.getRoom();
    this.getTeacher();
  }

  getRoom(): void {
    this.isLoading = true;
    if (
      this.classModel &&
      this.classModel.openingDate &&
      this.branchId &&
      this.classModel.shiftId &&
      this.classModel.classId
    ) {
      let date;
      if (this.startTime) {
        date = formatDate(this.startTime, 'yyyy-MM-dd', 'en-US');
      } else {
        date = formatDate(this.classModel?.openingDate, 'yyyy-MM-dd', 'en-US');
      }
      this.api
        .getRoomByBranchShiftOpeningDate(
          this.branchId,
          this.classModel?.shiftId,
          date,
          this.classModel.classId
        )
        .subscribe(
          (response) => {
            this.isLoading = false;
            this.roomArray = response.roomList;
            this.roomArray = this.roomArray.filter(
              (x) => x.roomId != this.form.controls.newRoomId.value
            );
          },
          (error) => {
            this.isLoading = false;
            this.callAlert(
              'Ok',
              'C?? l???i x???y ra khi t???i ph??ng h???c, vui l??ng th??? l???i'
            );
          }
        );
    }
  }

  getTeacher(): void {
    this.isLoading = true;
    if (
      this.branchId &&
      this.classModel?.subjectId &&
      this.classModel.openingDate &&
      this.classModel.shiftId
    ) {
      let date;
      if (this.startTime) {
        date = formatDate(this.startTime, 'yyyy-MM-dd', 'en-US');
      } else {
        date = formatDate(this.classModel?.openingDate, 'yyyy-MM-dd', 'en-US');
      }
      this.api
        .searchAvailTeacherForClass(
          this.branchId,
          this.classModel.shiftId,
          date,
          this.classModel?.subjectId
        )
        .subscribe(
          (data: TeacherSearchArray) => {
            this.isLoading = false;
            this.teacherArray = data.teacherList;
            this.teacherArray = this.teacherArray?.filter(
              (x) => x.teacherId != this.form.controls.newTeacherId.value
            );
          },
          (error) => {
            this.isLoading = false;
            this.callAlert(
              'Ok',
              'C?? l???i x???y ra khi t???i gi??o vi??n, vui l??ng th??? l???i'
            );
          }
        );
    }
  }

  getRoomListChange() {
    this.startTime = this.form.controls.newStartTime.value;
    this.getRoom();
    this.getTeacher();
  }

  editSession(): void {
    let changeDate;
    if (this.form.controls.newStartTime.value != null) {
      changeDate = this.datepipe.transform(
        this.form.controls.newStartTime.value,
        'yyyy-MM-dd HH:mm:ss'
      );
    } else {
      changeDate = '0';
    }
    let request: SessionRequest = {
      sessionId: this.sessionModel?.sessionId,
      classId: this.classModel?.classId,
      newRoomId: +this.form.controls.newRoomId.value,
      changeAllRoom: this.form.controls.changeAllRoom.value,
      newTeacherId: +this.form.controls.newTeacherId.value,
      changeAllTeacher: this.form.controls.changeAllTeacher.value,
      newStartTime: changeDate,
      changeAllTime: this.form.controls.changeAllTime.value,
      newShiftId: 0,
    };
    this.isLoading = true;
    this.api.updateSession(request).subscribe(
      (response) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.callAlert('Ok', 'Ch???nh s???a th??nh c??ng');
      },
      (error: HttpErrorResponse) => {
        this.isLoading = false;
        if (error.error === 'New Start Time already existed in Session List!') {
          this.callAlert(
            'Ok',
            'Ng??y b???n ch???n tr??ng v???i ng??y h???c c???a bu???i ti???p theo. Vui l??ng ch???n ?????i t???t c??? c??c bu???i h???c ?????i v???i ng??y d???i!'
          );
        } else if (
          error.error ===
          "You're changing the rest Sessions of this Class to another Shift. Please input new Shift ID!"
        ) {
          this.callAlert(
            'Ok',
            'B???n thay ?????i to??n b??? c??c ti???t hoc. Vui l??ng ch???n ng??y d???i thu???c c??c ng??y ' +
              this.classModel?.shiftDescription
          );
        } else {
          let err: string = error.error;
          if (err.includes('New start time not available!')) {
            err = err.replace(
              'New start time not available!',
              'Tr??ng th??ng tin v???i'
            );
            err = err.replace('Class', 'L???p');
            err = err.replace('of Teacher', 'c???a GV');
            err = err.replace('and Room', '??? ph??ng');
            err = err.replace('took this place!', '');
            this.callAlert('Ok', err);
          } else {
            this.callAlert(
              'Ok',
              'C?? l???i x???y ra khi ch???nh s???a, vui l??ng th??? l???i'
            );
          }
        }
      }
    );
  }

  onChange() {}

  doOk(): void {
    this.haveAlertOk = false;
    if (
      this.alertMessage === 'C?? l???i x???y ra khi t???i ph??ng h???c, vui l??ng th??? l???i'
    ) {
      this.getRoom();
    } else if (
      this.alertMessage === 'C?? l???i x???y ra khi t???i gi??o vi??n, vui l??ng th??? l???i'
    ) {
      this.getTeacher();
    } else if (this.alertMessage === 'Ch???nh s???a th??nh c??ng') {
      this.close();
    }
  }

  close(): void {
    this.haveAlertOk = false;
    this.dialogRef.close(this.isSuccess);
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
}
