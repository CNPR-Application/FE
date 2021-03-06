import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SubjectDialogComponent } from 'src/app/dashboard/subject-detail/subject-dialog/subject-dialog.component';
import {
  CurriculumResponse,
  CurriculumResponseArray,
} from 'src/interfaces/Curriculum';
import {
  Subject,
  SubjectDetail,
  SubjectDetailArray,
} from 'src/interfaces/Subject';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';
import { ValidationService } from 'src/service/validation.service';

@Component({
  selector: 'app-subject-detail',
  templateUrl: './subject-detail.component.html',
  styleUrls: ['./subject-detail.component.scss'],
})
export class SubjectDetailComponent implements OnInit {
  constructor(
    private service: LocalStorageService,
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    // 08/12/2021 QuangHN Add Validation Service START
    private validationService: ValidationService
  ) // 08/12/2021 QuangHN Add Validation Service END
  {}
  // id from service
  subjectId?: number;
  // curriculum detail model
  subject?: Subject;
  subjectDetail?: SubjectDetailArray;
  subjectDetailArray: Array<SubjectDetail> | undefined;
  //paging
  totalPage?: number;
  currentPage?: number;
  pageArray?: Array<number>;
  // for alert, loading
  isLoading: boolean = true;
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  //for edit/ create
  isEdit: boolean = false;
  isUndo: boolean = false;
  //dropdown list
  curriculumList?: Array<CurriculumResponseArray>;
  //clickedSubjectDetail
  clickedSubjectDetailId: number = 0;

  //form
  form = this.formBuilder.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    price: ['', Validators.required],
    slot: ['', Validators.required],
    slotPerWeek: ['', Validators.required],
    curriculumId: ['', Validators.required],
    rating: [],
    description: [],
    creatingDate: [],
    image: ['image'],
  });

  ngOnInit(): void {
    this.getListCurriculum();
    let message: string = this.service.get('message');
    if (message === 'editSubject') {
      this.subjectId = Number(this.service.get('data'));
      this.getDetail(this.subjectId);
      this.isEdit = true;
    } else if (message === 'createSubject') {
      this.isEdit = false;
      this.isUndo = false;
      this.isLoading = false;
      this.form.reset();
      this.form.controls.code.enable();
    } else if (message === 'undoSubject') {
      this.subjectId = Number(this.service.get('data'));
      this.getDetail(this.subjectId);
      this.isUndo = true;
    }
  }

  //dialog
  openDialog(subjectDetail?: SubjectDetail): void {
    let dialogRef = this.dialog.open(SubjectDialogComponent, {
      data: { subjectDetail: subjectDetail, subject: this.subject },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.getListSubjectDetail(data, true, 1, 5);
      }
    });
  }

  getListCurriculum(): void {
    this.api.getCurriculumByName('', true, 1, 100).subscribe(
      (response: CurriculumResponse) => {
        this.curriculumList = response.curriculumResponseDtos;
      },
      (error) => {
        this.api.getCurriculumByName('', true, 1, 100);
      }
    );
  }

  getDetail(id: number) {
    this.isLoading = true;
    this.api.getSubjectDetail(id).subscribe(
      (response: Subject) => {
        this.subject = response;
        this.form.controls.code.setValue(this.subject.subjectCode);
        this.form.controls.name.setValue(this.subject.subjectName);
        this.form.controls.description.setValue(this.subject.description);
        this.form.controls.curriculumId.setValue(this.subject.curriculumId);
        this.form.controls.rating.setValue(this.subject.rating);
        this.form.controls.price.setValue(this.subject.price);
        this.form.controls.slot.setValue(this.subject.slot);
        this.form.controls.slotPerWeek.setValue(this.subject.slotPerWeek);
        this.form.controls.creatingDate.setValue(this.subject.creatingDate);
        this.form.controls.code.disable();
        if (this.subject.subjectId) {
          this.getListSubjectDetail(this.subject.subjectId, true, 1, 5);
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'C?? l???i x???y ra khi t???i, vui l??ng th??? l???i');
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/dashboard/curriculum']);
  }

  editSubject(): void {
    // 08/12/2021 QuangHN Add validate for editSubject form START
    let subjectCode = this.form.controls.code.value;
    let subjectName = this.form.controls.name.value;
    let price = this.form.controls.price.value;
    let slot = this.form.controls.slot.value;
    let slotPerWeek = this.form.controls.slotPerWeek.value;
    let curriculumId = this.form.controls.curriculumId.value;
    let description = this.form.controls.description.value;

    // check null
    if (this.validationService.isNull(subjectCode, 'M?? m??n h???c')) {
      return;
    }
    if (this.validationService.isNull(subjectName, 'T??n m??n h???c')) {
      return;
    }
    if (this.validationService.isNull(price, 'H???c ph??')) {
      return;
    }
    if (this.validationService.isNull(slot, 'T???ng bu???i h???c')) {
      return;
    }
    if (this.validationService.isNull(slotPerWeek, 'S??? bu???i/ tu???n')) {
      return;
    }
    if (this.validationService.isNull(curriculumId, 'Ch????ng tr??nh')) {
      return;
    }
    if (this.validationService.isNull(description, 'Mi??u t??? m??n h???c')) {
      return;
    }

    // check invalid
    if (this.validationService.isInvalidInput(subjectCode, 'M?? m??n h???c')) {
      return;
    }
    if (this.validationService.isInvalidInput(subjectName, 'T??n m??n h???c')) {
      return;
    }
    if (
      this.validationService.isInvalidTextArea(description, 'Mi??u t??? m??n h???c')
    ) {
      return;
    }

    // check zero or lower
    if (this.validationService.isZeroOrLower(price, 'H???c ph??')) {
      return;
    }
    if (this.validationService.isZeroOrLower(slot, 'T???ng bu???i h???c')) {
      return;
    }
    if (this.validationService.isZeroOrLower(slotPerWeek, 'S??? bu???i/ tu???n')) {
      return;
    }
    // 08/12/2021 QuangHN Add validate for editSubject form END

    const request: Subject = {
      subjectId: this.subjectId,
      subjectCode: this.form.controls.code.value,
      subjectName: this.form.controls.name.value,
      description: this.form.controls.description.value,
      slot: this.form.controls.slot.value,
      price: this.form.controls.price.value,
      slotPerWeek: this.form.controls.slotPerWeek.value,
      creatingDate: this.form.controls.creatingDate.value,
      curriculumId: this.form.controls.curriculumId.value,
      rating: this.form.controls.rating.value,
      isAvailable: this.subject?.isAvailable,
    };
    this.isLoading = true;
    this.api.updateSubject(request).subscribe(
      (response: boolean) => {
        this.isLoading = false;
        if (response) {
          this.callAlert('Ok', 'Ch???nh s???a th??nh c??ng');
          this.getDetail(Number(this.service.get('data')));
          this.isEdit = true;
          this.isUndo = false;
          setTimeout(() => {
            this.goBack();
          }, 1000);
        } else {
          this.callAlert('Ok', 'T??n m??n h???c ???? t???n t???i, vui l??ng th??? l???i');
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'C?? l???i x???y ra khi ch???nh s???a, vui l??ng th??? l???i');
      }
    );
  }

  createSubject(): void {
    // 08/12/2021 QuangHN Add validate for createSubject form START
    let subjectCode = this.form.controls.code.value;
    let subjectName = this.form.controls.name.value;
    let price = this.form.controls.price.value;
    let slot = this.form.controls.slot.value;
    let slotPerWeek = this.form.controls.slotPerWeek.value;
    let curriculumId = this.form.controls.curriculumId.value;
    let description = this.form.controls.description.value;

    // check null
    if (this.validationService.isNull(subjectCode, 'M?? m??n h???c')) {
      return;
    }
    if (this.validationService.isNull(subjectName, 'T??n m??n h???c')) {
      return;
    }
    if (this.validationService.isNull(price, 'H???c ph??')) {
      return;
    }
    if (this.validationService.isNull(slot, 'T???ng bu???i h???c')) {
      return;
    }
    if (this.validationService.isNull(slotPerWeek, 'S??? bu???i/ tu???n')) {
      return;
    }
    if (this.validationService.isNull(curriculumId, 'Ch????ng tr??nh')) {
      return;
    }
    if (this.validationService.isNull(description, 'Mi??u t??? m??n h???c')) {
      return;
    }

    // check invalid
    if (this.validationService.isInvalidInput(subjectCode, 'M?? m??n h???c')) {
      return;
    }
    if (this.validationService.isInvalidInput(subjectName, 'T??n m??n h???c')) {
      return;
    }
    if (
      this.validationService.isInvalidTextArea(description, 'Mi??u t??? m??n h???c')
    ) {
      return;
    }

    // check zero or lower
    if (this.validationService.isZeroOrLower(price, 'H???c ph??')) {
      return;
    }
    if (this.validationService.isZeroOrLower(slot, 'T???ng bu???i h???c')) {
      return;
    }
    if (this.validationService.isZeroOrLower(slotPerWeek, 'S??? bu???i/ tu???n')) {
      return;
    }
    // 08/12/2021 QuangHN Add validate for createSubject form END

    const request: Subject = {
      subjectId: 1,
      subjectCode: this.form.controls.code.value,
      subjectName: this.form.controls.name.value,
      description: this.form.controls.description.value,
      curriculumId: this.form.controls.curriculumId.value,
      slot: this.form.controls.slot.value,
      price: this.form.controls.price.value,
      rating: this.form.controls.rating.value,
      slotPerWeek: this.form.controls.slotPerWeek.value,
      creatingDate: this.form.controls.creatingDate.value,
      isAvailable: this.subject?.isAvailable,
    };
    this.isLoading = true;
    this.api.createSubject(request).subscribe(
      (response: boolean) => {
        this.isLoading = false;
        if (response) {
          this.callAlert('Ok', 'T???o m???i th??nh c??ng');
          setTimeout(() => {
            this.goBack();
          }, 1000);
        } else {
          this.callAlert(
            'Ok',
            'M?? m??n h???c/ T??n m??n h???c ???? c??. Vui l??ng th??? l???i'
          );
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'C?? l???i x???y ra khi t???o m???i, vui l??ng th??? l???i');
      }
    );
  }

  //getListSubject
  getListSubjectDetail(
    subjectId: number,
    isAvailable: boolean,
    pageNo: number,
    pageSize: number
  ): void {
    this.isLoading = true;
    this.api
      .getSubjectDetailBySubjectId(subjectId, isAvailable, pageNo, pageSize)
      .subscribe(
        (response: SubjectDetailArray) => {
          this.subjectDetail = response;
          this.subjectDetailArray = response.subjectDetailDtoList;
          this.totalPage = response.totalPage;
          this.currentPage = this.subjectDetail.pageNo;
          this.pageArray = Array(this.totalPage)
            .fill(1)
            .map((x, i) => i + 1)
            .reverse();
          this.isLoading = false;
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
          this.callAlert('Ok', 'C?? l???i x???y ra khi t???i, vui l??ng th??? l???i');
          this.isLoading = false;
        }
      );
  }

  deleteSubjectDetail(): void {
    this.isLoading = true;
    this.api.deleteSubjectDetail(this.clickedSubjectDetailId).subscribe(
      (response: boolean) => {
        this.isLoading = false;
        if (response) {
          this.callAlert('Ok', 'X??a th??nh c??ng');
          if (this.subjectId) {
            this.getListSubjectDetail(this.subjectId, true, 1, 5);
          }
        } else {
          this.callAlert('Ok', 'M?? m??n h???c kh??ng t???n t???i. Vui l??ng th??? l???i');
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'C?? l???i x???y ra khi x??a, vui l??ng th??? l???i');
      }
    );
  }

  changePage(page: number): void {
    if (this.subjectId) {
      this.getListSubjectDetail(this.subjectId, true, page, 5);
    }
  }

  doYes(): void {
    if (this.alertMessage === 'B???n c?? mu???n x??a n???i dung h???c tu???n n??y kh??ng ?') {
      this.deleteSubjectDetail();
    } else {
      if (this.subject) {
        this.subject.isAvailable = true;
      }
      this.editSubject();
    }
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
    if (param) {
      this.clickedSubjectDetailId = param;
    }
  }
}
