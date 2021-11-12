import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Booking, BookingArray } from 'src/interfaces/Booking';
import { ApiService } from 'src/service/api.service';
import { StudentInClassComponent } from '../../schedule/student-in-class/student-in-class.component';

@Component({
  selector: 'app-class-booking',
  templateUrl: './class-booking.component.html',
  styleUrls: ['./class-booking.component.scss'],
})
export class ClassBookingComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<StudentInClassComponent>,
    private api: ApiService
  ) {}

  // for alert, loading
  isLoading: boolean = false;
  haveAlertOk: boolean = false;
  alertMessage: string = '';
  studentList?: Array<Booking>;
  half1List?: Array<Booking>;
  half2List?: Array<Booking>;

  isDisplayHalf: boolean = false;

  ngOnInit(): void {
    this.isLoading = true;
    this.api
      .searchBookingByClassIdAndStatus(this.data.classId, 'paid', 1, 1000)
      .subscribe(
        (response: BookingArray) => {
          this.studentList = response.classList;
          if (this.studentList && this.studentList?.length > 6) {
            this.half1List = this.studentList?.slice(
              0,
              this.studentList.length / 2
            );
            this.half2List = this.studentList?.slice(
              this.studentList.length / 2,
              this.studentList.length
            );
            this.isDisplayHalf = true;
          }
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.callAlert('Có lỗi xảy ra khi tải');
        }
      );
  }

  callAlert(message: string) {
    this.alertMessage = message;
    this.haveAlertOk = true;
  }

  close() {
    this.dialogRef.close();
  }
}
