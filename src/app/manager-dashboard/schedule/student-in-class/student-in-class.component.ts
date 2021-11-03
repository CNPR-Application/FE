import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  StudentInClassListResponse,
  StudentInClassResponse
} from 'src/interfaces/StudentInClass';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-student-in-class',
  templateUrl: './student-in-class.component.html',
  styleUrls: ['./student-in-class.component.scss'],
})
export class StudentInClassComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<StudentInClassComponent>,
    private api: ApiService
  ) {}

  // for alert, loading
  isLoading: boolean = false;
  haveAlertOk: boolean = false;
  alertMessage: string = '';
  studentList?: Array<StudentInClassResponse>;
  half1List?: Array<StudentInClassResponse>;
  half2List?: Array<StudentInClassResponse>;

  ngOnInit(): void {
    this.isLoading = true;
    this.api.getAllStudentInClass(this.data.classId, 1, 1000).subscribe(
      (response: StudentInClassListResponse) => {
        this.studentList = response.studentInClassSearchResponseDtos;
        this.half1List = this.studentList?.slice(
          0,
          this.studentList.length / 2
        );
        this.half2List = this.studentList?.slice(
          this.studentList.length / 2,
          this.studentList.length
        );
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
