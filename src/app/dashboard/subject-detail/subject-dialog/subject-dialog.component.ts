import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, SubjectDetail } from 'src/interfaces/Subject';
import { ApiService } from 'src/service/api.service';
import { ValidationService } from 'src/service/validation.service';

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
    private dialogRef: MatDialogRef<SubjectDialogComponent>,
    // 08/12/2021 QuangHN Add Validation Service START
    private validationService: ValidationService
  ) // 08/12/2021 QuangHN Add Validation Service END
  {}

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
  form: FormGroup = this.formBuilder.group({
    id: ['', Validators.required],
    weekNum: ['', Validators.required],
    subjectId: ['', Validators.required],
    learningOutcome: [],
    description: [],
  });
  //isSuccess
  isSuccess = false;

  ngOnInit(): void {
    this.subject = this.data.subject;
    this.form.controls.subjectId.setValue(
      this.subject?.subjectCode + ' - ' + this.subject?.subjectName
    );
    this.subjectDetail = this.data.subjectDetail;
    if (this.subjectDetail !== undefined) {
      this.subjectDetail = this.data.subjectDetail;
      this.isEdit = true;
      this.form.controls.id.setValue(this.subjectDetail?.subjectDetailId);
      this.form.controls.id.disable();
      this.form.controls.weekNum.setValue(this.subjectDetail?.weekNum);
      this.form.controls.description.setValue(
        this.subjectDetail?.weekDescription
      );
      this.form.controls.learningOutcome.setValue(
        this.subjectDetail?.learningOutcome
      );
    } else {
      this.isEdit = false;
    }
  }

  editSubjectDetail(): void {
    // 08/12/2021 QuangHN Add validate for editSubjectDetail form START
    let weekNum = this.form.controls.weekNum.value;
    let weekDescription = this.form.controls.description.value;
    let learningOutcome = this.form.controls.learningOutcome.value;

    // check null
    if (this.validationService.isNull(weekNum, 'Tu???n s???')) {
      return;
    }
    if (this.validationService.isNull(weekDescription, 'N???i dung h???c')) {
      return;
    }
    if (this.validationService.isNull(learningOutcome, 'K???t qu??? ?????t ???????c')) {
      return;
    }

    // check invalid
    if (
      this.validationService.isInvalidTextArea(weekDescription, 'N???i dung h???c')
    ) {
      return;
    }
    if (
      this.validationService.isInvalidTextArea(
        learningOutcome,
        'K???t qu??? ?????t ???????c'
      )
    ) {
      return;
    }

    // check zero equal
    if (this.validationService.isZeroOrLower(weekNum, 'Tu???n s???')) {
      return;
    }
    // 08/12/2021 QuangHN Add validate for editSubjectDetail form END

    this.isLoading = true;
    const request: SubjectDetail = {
      subjectDetailId: this.subjectDetail?.subjectDetailId,
      subjectId: this.subject?.subjectId,
      weekNum: this.form.controls.weekNum.value,
      weekDescription: this.form.controls.description.value,
      learningOutcome: this.form.controls.learningOutcome.value,
      isAvailable: true,
    };
    this.service.updateSubjectDetail(request).subscribe(
      (response: boolean) => {
        this.isLoading = false;
        if (response) {
          this.callAlert('Ok', 'Ch???nh s???a th??nh c??ng');
          this.isSuccess = true;
        } else {
          this.callAlert('Ok', 'C?? l???i x???y ra. Vui l??ng th??? l???i');
          this.isSuccess = false;
        }
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        this.callAlert('Ok', 'C?? l???i x???y ra khi ch???nh s???a, vui l??ng th??? l???i');
        this.isLoading = false;
        this.isSuccess = false;
      }
    );
  }
  createSubjectDetail(): void {
    // 08/12/2021 QuangHN Add validate for createSubjectDetail form START
    let weekNum = this.form.controls.weekNum.value;
    let weekDescription = this.form.controls.description.value;
    let learningOutcome = this.form.controls.learningOutcome.value;

    // check null
    if (this.validationService.isNull(weekNum, 'Tu???n s???')) {
      return;
    }
    if (this.validationService.isNull(weekDescription, 'N???i dung h???c')) {
      return;
    }
    if (this.validationService.isNull(learningOutcome, 'K???t qu??? ?????t ???????c')) {
      return;
    }

    // check invalid
    if (
      this.validationService.isInvalidTextArea(weekDescription, 'N???i dung h???c')
    ) {
      return;
    }
    if (
      this.validationService.isInvalidTextArea(
        learningOutcome,
        'K???t qu??? ?????t ???????c'
      )
    ) {
      return;
    }

    // check zero equal
    if (this.validationService.isZeroOrLower(weekNum, 'Tu???n s???')) {
      return;
    }
    // 08/12/2021 QuangHN Add validate for createSubjectDetail form END

    this.isLoading = true;
    const request: SubjectDetail = {
      subjectDetailId: 0,
      weekNum: this.form.controls.weekNum.value,
      subjectId: this.subject?.subjectId,
      weekDescription: this.form.controls.description.value,
      learningOutcome: this.form.controls.learningOutcome.value,
      isAvailable: true,
    };
    this.service.createSubjectDetail(request).subscribe(
      (response: boolean) => {
        this.isLoading = false;
        if (response) {
          this.callAlert('Ok', 'T???o m???i th??nh c??ng');
          this.isSuccess = true;
        } else {
          this.callAlert('Ok', 'C?? l???i x???y ra. Vui l??ng th??? l???i');
          this.isSuccess = false;
        }
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        this.isLoading = false;
        if (
          error.error == 'Number of weeks for this Subject is at their limit!'
        ) {
          this.callAlert(
            'Ok',
            'S??? l?????ng tu???n c???a l???p h???c n??y ???? v?????t qu??, kh??ng th??? th??m m???i'
          );
        } else {
          this.callAlert('Ok', 'C?? l???i x???y ra khi t???o m???i, vui l??ng th??? l???i');
        }
        this.isSuccess = false;
      }
    );
  }

  close(): void {
    this.haveAlertOk = false;
    if (this.isSuccess) {
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
