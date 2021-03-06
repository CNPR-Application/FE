import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  DAY_OF_WEEKS,
  Shift,
  shiftModel,
  TIME_START,
} from 'src/interfaces/Shift';
import { ApiService } from 'src/service/api.service';
import { ValidationService } from 'src/service/validation.service';

@Component({
  selector: 'app-shift-dialog',
  templateUrl: './shift-dialog.component.html',
  styleUrls: ['./shift-dialog.component.scss'],
})
export class ShiftDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ShiftDialogComponent>,
    private validationService: ValidationService
  ) {}

  timeStartArray = TIME_START;
  dayOfWeekArray = DAY_OF_WEEKS;

  // for alert, loading
  isLoading: boolean = false;
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  //form
  form: FormGroup = this.formBuilder.group({
    id: ['', Validators.required],
    dayOfWeek: ['', Validators.required],
    timeStart: ['', Validators.required],
    duration: [90, Validators.required],
  });
  //isSuccess
  isSuccess = false;
  // array of chosen day
  chosenDays: string[] = [];

  ngOnInit(): void {}

  createShift(): void {
    // 06/12/2021 QuangHN Add Validate for create shift form START
    let timeStart = this.form.controls.timeStart.value;

    // check null
    if (this.validationService.isNull(timeStart, 'Thời gian bắt đầu')) {
      return;
    }
    // 06/12/2021 QuangHN Add Validate for create shift form END
    this.isLoading = true;
    this.chosenDays.sort();
    let value = '';
    for (let i = 0; i < this.chosenDays.length; i++) {
      if (i !== this.chosenDays.length - 1) {
        value = value.concat(this.chosenDays[i] + '-');
      } else {
        value = value.concat(this.chosenDays[i]);
      }
    }
    const request: Shift = {
      dayOfWeek: value,
      timeStart: this.form.controls.timeStart.value,
      duration: this.form.controls.duration.value,
    };
    this.api.createShift(request).subscribe(
      (response: boolean) => {
        if (response) {
          this.callAlert('Ok', 'Tạo ca học thành công');
          this.isSuccess = true;
        } else {
          this.callAlert('Ok', 'Ca học này đã tồn tại, vui lòng tạo tên mới');
          this.isSuccess = false;
        }
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.callAlert('Ok', 'Có lỗi xảy ra, vui lòng thử lại');
        this.isLoading = false;
        this.isSuccess = false;
      }
    );
  }

  close(): void {
    this.haveAlertOk = false;
    if (this.isSuccess) {
      this.dialogRef.close(true);
    }
  }

  doYes(): void {
    this.haveAlertYN = false;
    this.createShift();
  }

  doNo(): void {
    this.haveAlertYN = false;
  }

  callAlert(type: string, message: string) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
    }
  }

  addDay(i: shiftModel): void {
    if (i.trans === 'in') {
      this.chosenDays.forEach((day, index) => {
        if (day === i.value) {
          this.chosenDays.splice(index, 1);
          i.trans = '';
        }
      });
    } else {
      this.chosenDays.push(i.value);
      i.trans = 'in';
    }
  }
}
