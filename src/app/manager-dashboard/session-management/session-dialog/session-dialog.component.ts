import { DatePipe, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClassResponse } from 'src/interfaces/Class';
import { RoomResponse } from 'src/interfaces/Room';
import { SessionRequest, SessionResponse } from 'src/interfaces/Session';
import { TeacherArray, TeacherInfo } from 'src/interfaces/Teacher';
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
    changeAllTeacher: [null, Validators.required],
    newRoomId: [null, Validators.required],
    changeAllRoom: [null, Validators.required],
    newStartTime: [null, Validators.required],
    changeAllTime: [null, Validators.required],
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

  ngOnInit(): void {
    this.classModel = this.data.class;
    this.sessionModel = this.data.session;
    this.branchId = this.classModel?.branchId;
    this.startTime = this.sessionModel?.startTime;
    this.form.controls.newRoomId.setValue(this.sessionModel?.roomId);
    this.form.controls.newTeacherId.setValue(this.sessionModel?.teacherId);
    this.getRoom();
    this.getTeacher();
  }

  getRoom(): void {
    this.isLoading = true;
    if (
      this.classModel &&
      this.classModel.openingDate &&
      this.branchId &&
      this.classModel.shiftId
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
          date
        )
        .subscribe(
          (response) => {
            this.isLoading = false;
            this.roomArray = response.roomList;
          },
          (error) => {
            this.isLoading = false;
            this.callAlert(
              'Ok',
              'Có lỗi xảy ra khi tải phòng học, vui lòng thử lại'
            );
          }
        );
    }
  }

  getTeacher(): void {
    this.isLoading = true;
    if (this.branchId && this.classModel?.subjectId) {
      this.api
        .searchTeacherByBranchSubject(
          this.branchId,
          this.classModel?.subjectId,
          1,
          1000
        )
        .subscribe(
          (data: TeacherArray) => {
            this.isLoading = false;
            this.teacherArray = data.teacherInBranchList;
          },
          (error) => {
            this.isLoading = false;
            this.callAlert(
              'Ok',
              'Có lỗi xảy ra khi tải giáo viên, vui lòng thử lại'
            );
          }
        );
    }
  }

  editSession(): void {
    let changeDate;
    if (this.form.controls.newStartTime.value != null) {
      changeDate = this.datepipe.transform(
        this.form.controls.newStartTime.value,
        'yyyy-MM-dd HH:mm:ss'
      );
    } else {
      changeDate = null;
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
    };
    this.isLoading = true;
    this.api.updateSession(request).subscribe(
      (response) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.callAlert('Ok', 'Chỉnh sửa thành công');
      },
      (error: HttpErrorResponse) => {
        this.isLoading = false;
        if (error.error === 'New Start Time already existed in Session List!') {
          this.callAlert(
            'Ok',
            'Ngày bạn chọn trùng với ngày học của buổi tiếp theo. Vui lòng chọn đổi tất cả các buổi học đối với ngày dời!'
          );
        } else if (
          error.error ===
          "You're changing the rest Sessions of this Class to another Shift. Please input new Shift ID!"
        ) {
          this.callAlert(
            'Ok',
            'Vui lòng chọn ngày dời thuộc các ngày ' +
              this.classModel?.shiftDescription
          );
        } else {
          this.callAlert('Ok', 'Có lỗi xảy ra khi chỉnh sửa, vui lòng thử lại');
        }
      }
    );
  }

  onChange() {}

  doOk(): void {
    this.haveAlertOk = false;
    if (
      this.alertMessage === 'Có lỗi xảy ra khi tải phòng học, vui lòng thử lại'
    ) {
      this.getRoom();
    } else if (
      this.alertMessage === 'Có lỗi xảy ra khi tải giáo viên, vui lòng thử lại'
    ) {
      this.getTeacher();
    } else if (this.alertMessage === 'Chỉnh sửa thành công') {
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
