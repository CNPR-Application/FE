import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, SubjectArray, SubjectDetail } from 'src/interfaces/Subject';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-subject-dialog',
  templateUrl: './subject-dialog.component.html',
  styleUrls: ['./subject-dialog.component.scss'],
})
export class SubjectDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: ApiService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<SubjectDialogComponent>
  ) {}

  // subject detail model
  subjectDetail?: SubjectDetail;
  subject?: Subject;
  // for alert, loading
  isLoading: boolean = false;
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  //for edit/ create
  isEdit: boolean = false;
  //form
  form : FormGroup = this.formBuilder.group({
    id: ['',Validators.required],
    weekNum: ['',Validators.required],
    subjectId: ['',Validators.required],
    learningOutcome: [],
    description: [],
  });
  //isSuccess
  isSuccess = false;

  ngOnInit(): void {
    this.subject = this.data.subject;
    this.form.controls.subjectId.setValue(this.subject?.subjectCode+" - "+this.subject?.subjectName);
    this.subjectDetail = this.data.subjectDetail;
    if(this.subjectDetail !== undefined){
      this.subjectDetail = this.data.subjectDetail;
      this.isEdit = true;
      this.form.controls.id.setValue(this.subjectDetail?.subjectDetailId);
      this.form.controls.id.disable();
      this.form.controls.weekNum.setValue(this.subjectDetail?.weekNum);
      this.form.controls.description.setValue(this.subjectDetail?.weekDescription);
      this.form.controls.learningOutcome.setValue(this.subjectDetail?.learningOutcome);
    }else{
      this.isEdit = false;
    }
  }

  editSubjectDetail(): void {
    this.isLoading = true;
    const request:SubjectDetail = {
      subjectDetailId: this.subjectDetail?.subjectDetailId,
      subjectId: this.subject?.subjectId,
      weekNum: this.form.controls.weekNum.value,
      weekDescription: this.form.controls.description.value,
      learningOutcome: this.form.controls.learningOutcome.value,
      isAvailable: true
    }
    this.service.updateSubjectDetail(request).subscribe(
      (response: boolean) => {
        this.isLoading = false;
        if (response) {
          this.callAlert('Ok', 'Chỉnh sửa thành công');
          this.isSuccess = true;
        } else {
          this.callAlert('Ok', 'Có lỗi xảy ra. Vui lòng thử lại');
          this.isSuccess = false;
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi chỉnh sửa, vui lòng thử lại');
        this.isSuccess = false;
      }
    );
  }
  createSubjectDetail(): void {
    this.isLoading = true;
    const request:SubjectDetail = {
      subjectDetailId: 0,
      weekNum: this.form.controls.weekNum.value,
      subjectId: this.subject?.subjectId,
      weekDescription: this.form.controls.description.value,
      learningOutcome: this.form.controls.learningOutcome.value,
      isAvailable: true
    }
    this.service.createSubjectDetail(request).subscribe(
      (response: boolean) => {
        this.isLoading = false;
        if (response) {
          this.callAlert('Ok', 'Thêm mới thành công');
          this.isSuccess = true;
        } else {
          this.callAlert('Ok', 'Có lỗi xảy ra. Vui lòng thử lại');
          this.isSuccess = false;
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi chỉnh sửa, vui lòng thử lại');
        this.isSuccess = false;
      }
    );
  }

  close():void{
    this.haveAlertOk = false;
    if(this.isSuccess){
      this.dialogRef.close(this.subject?.subjectId);
    }
  }

  callAlert(type: string, message: string) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
    }
  }
}
