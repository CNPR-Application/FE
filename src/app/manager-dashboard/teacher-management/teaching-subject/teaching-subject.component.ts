import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, SubjectArray } from 'src/interfaces/Subject';
import {
    SubjectInTeacher,
    TeacherInfo,
    TeachingSubjectRequest
} from 'src/interfaces/Teacher';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-teaching-subject',
  templateUrl: './teaching-subject.component.html',
  styleUrls: ['./teaching-subject.component.scss'],
})
export class TeachingSubjectComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TeachingSubjectComponent>,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) {}

  form = this.formBuilder.group({
    subjectId: ['', Validators.required],
  });
  subjectAllList?: Array<Subject>;
  teacher?: TeacherInfo;
  subjectList?: Array<SubjectInTeacher>;
  // for alert, loading
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  isLoadingSubject: boolean = false;
  //for delete
  clickedSubject?: SubjectInTeacher;

  ngOnInit(): void {
    this.teacher = this.data.teacher;
    this.getListTeachingSubject();
    this.getListSubject();
  }

  getListSubject(): void {
    this.api.getSubjectByName('', true, 1, 1000).subscribe(
      (response: SubjectArray) => {
        this.subjectAllList = response.subjectsResponseDtos;
        this.isLoadingSubject = false;
      },
      (error) => {
        this.isLoadingSubject = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi tải môn học, vui lòng thử lại');
      }
    );
  }

  createTeachingSubject(): void {
    let request: TeachingSubjectRequest = {
      teacherUsername: this.teacher?.teacherUsername,
      subjectId: this.form.controls.subjectId.value,
    };
    this.isLoadingSubject = true;
    this.api.createTeachingSubject(request).subscribe(
      (response) => {
        this.isLoadingSubject = false;
        if (response) {
          this.callAlert('Ok', 'Tạo mới thành công');
          this.getListTeachingSubject();
        } else {
          this.callAlert('Ok', 'Có lỗi xảy ra khi tạo mới, vui lòng thử lại');
        }
      },
      (error: HttpErrorResponse) => {
        this.isLoadingSubject = false;
        console.log(error);
        if (error.error === 'This Teaching Subject is already taken!') {
          this.callAlert('Ok', 'Môn học này đã tồn tại, vui lòng thử lại');
        } else {
          this.callAlert('Ok', 'Có lỗi xảy ra khi tạo mới, vui lòng thử lại');
        }
      }
    );
  }

  deleteTeachingSubject(subject: SubjectInTeacher): void {
    let request: TeachingSubjectRequest = {
      teacherUsername: this.teacher?.teacherUsername,
      subjectId: subject.subjectId,
    };
    this.isLoadingSubject = true;
    this.api.deleteTeachingSubject(request).subscribe(
      (response) => {
        this.isLoadingSubject = false;
        if (response) {
          this.callAlert('Ok', 'Xóa thành công');
          this.getListTeachingSubject();
        } else {
          this.callAlert('Ok', 'Có lỗi xảy ra khi xóa, vui lòng thử lại');
        }
      },
      (error: HttpErrorResponse) => {
        this.isLoadingSubject = false;
        console.log(error);
        if (error.error === 'This Teaching Subject is UNABLE to delete!') {
          this.callAlert(
            'Ok',
            'Môn học này đang được giảng dạy, vui lòng thử lại'
          );
        } else {
          this.callAlert('Ok', 'Có lỗi xảy ra khi xóa, vui lòng thử lại');
        }
      }
    );
  }

  getListTeachingSubject(): void {
    this.isLoadingSubject = true;
    if (this.teacher?.teacherUsername)
      this.api
        .searchTeachingSubjectByTeacherUsername(this.teacher?.teacherUsername)
        .subscribe(
          (response: SubjectInTeacher[]) => {
            this.subjectList = response;
            this.isLoadingSubject = false;
          },
          (error) => {
            this.isLoadingSubject = false;
            this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
          }
        );
  }

  doOk(): void {
    this.haveAlertOk = false;
    if (
      this.alertMessage === 'Có lỗi xảy ra khi tải môn học, vui lòng thử lại'
    ) {
      this.getListSubject();
    }
  }

  close(): void {
    this.haveAlertOk = false;
    this.dialogRef.close();
  }

  callAlert(type: string, message: string, param?: any) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
      if (param) {
        this.clickedSubject = param;
      }
    }
  }

  doYes(): void {
    this.haveAlertYN = false;
    if (this.clickedSubject) {
      this.deleteTeachingSubject(this.clickedSubject);
    }
  }

  doNo(): void {
    this.haveAlertYN = false;
  }
}
