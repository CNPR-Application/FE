import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CurriculumResponseArray } from 'src/interfaces/Curriculum';
import { Subject, SubjectArray } from 'src/interfaces/Subject';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';
import { ValidationService } from 'src/service/validation.service';

@Component({
  selector: 'app-detail-curriculum',
  templateUrl: './detail-curriculum.component.html',
  styleUrls: ['./detail-curriculum.component.scss'],
})
export class DetailCurriculumComponent implements OnInit {
  constructor(
    private service: LocalStorageService,
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    // 03/12/2021 QuangHN Add Validation Service START
    private validationService: ValidationService
  ) // 03/12/2021 QuangHN Add Validation Service END
  {}
  // id from service
  curriculumId?: number;
  // curriculum detail model
  curriculum?: CurriculumResponseArray;
  subject?: SubjectArray;
  subjectArray: Array<Subject> | undefined;
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
  //clickSubject
  clickId: number = 0;

  //form
  form = this.formBuilder.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [],
    learningOutcome: [],
    image: ['image'],
    clip: ['link-clip'],
  });

  ngOnInit(): void {
    let message: string = this.service.get('message');
    if (message === 'editCurriculum') {
      this.curriculumId = this.service.get('data');
      if (this.curriculumId) {
        this.getDetail(this.curriculumId);
        this.isEdit = true;
        this.isUndo = false;
      }
    } else if (message === 'createCurriculum') {
      this.isEdit = false;
      this.isUndo = false;
      this.isLoading = false;
      this.form.reset();
      this.form.controls.code.enable();
    } else if (message === 'undoCurriculum') {
      this.curriculumId = this.service.get('data');
      if (this.curriculumId) {
        this.getDetail(this.curriculumId);
      }
      this.isUndo = true;
    }
  }

  getDetail(id: number) {
    this.isLoading = true;
    this.api.getCurriculumDetail(id).subscribe(
      (response: CurriculumResponseArray) => {
        this.curriculum = response;
        this.form.controls.code.setValue(this.curriculum.curriculumCode);
        this.form.controls.name.setValue(this.curriculum.curriculumName);
        this.form.controls.description.setValue(this.curriculum.description);
        this.form.controls.learningOutcome.setValue(
          this.curriculum.learningOutcome
        );
        this.form.controls.code.disable();
        if (this.curriculum.curriculumId) {
          this.getListSubject(this.curriculum.curriculumId, true, 1, 5);
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/dashboard/curriculum']);
  }

  editCurriculum(): void {
    // 03/12/2021 QuangHN Add Validation for edit curriculum START
    let curriculumCode = this.form.controls.code.value;
    let curriculumName = this.form.controls.name.value;
    let description = this.form.controls.description.value;
    let learningOutcome = this.form.controls.learningOutcome.value;

    // check null
    if (this.validationService.isNull(curriculumCode, 'Mã chương trình')) {
      return;
    }
    if (this.validationService.isNull(curriculumName, 'Tên chương trình')) {
      return;
    }
    if (this.validationService.isNull(description, 'Miêu tả chương trình')) {
      return;
    }
    if (this.validationService.isNull(learningOutcome, 'Kết quả đạt được')) {
      return;
    }

    // check invalid
    if (
      this.validationService.isInvalidInput(curriculumCode, 'Mã chương trình')
    ) {
      return;
    }
    if (
      this.validationService.isInvalidInput(curriculumName, 'Tên chương trình')
    ) {
      return;
    }
    if (
      this.validationService.isInvalidTextArea(
        description,
        'Miêu tả chương trình'
      )
    ) {
      return;
    }
    if (
      this.validationService.isInvalidTextArea(
        learningOutcome,
        'Kết quả đạt được'
      )
    ) {
      return;
    }
    // 03/12/2021 QuangHN Add Validation for edit curriculum END

    const request: CurriculumResponseArray = {
      curriculumId: this.curriculumId,
      curriculumCode: this.form.controls.code.value,
      curriculumName: this.form.controls.name.value,
      description: this.form.controls.description.value,
      learningOutcome: this.form.controls.learningOutcome.value,
      isAvailable: this.curriculum?.isAvailable,
    };
    this.isLoading = true;
    this.api.editCurriculum(request).subscribe(
      (response: boolean) => {
        this.isLoading = false;
        if (response) {
          this.callAlert('Ok', 'Chỉnh sửa thành công');
          this.getDetail(Number(this.service.get('data')));
          this.isEdit = true;
          this.isUndo = false;
          setTimeout(() => {
            this.goBack();
          }, 1000);
        } else {
          this.callAlert('Ok', 'Tên chương trình đã tồn tại, vui lòng thử lại');
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi chỉnh sửa, vui lòng thử lại');
      }
    );
  }

  createCurriculum(): void {
    // 03/12/2021 QuangHN Add Validation for create curriculum START
    let curriculumCode = this.form.controls.code.value;
    let curriculumName = this.form.controls.name.value;
    let description = this.form.controls.description.value;
    let learningOutcome = this.form.controls.learningOutcome.value;

    // check null
    if (this.validationService.isNull(curriculumCode, 'Mã chương trình')) {
      return;
    }
    if (this.validationService.isNull(curriculumName, 'Tên chương trình')) {
      return;
    }
    if (this.validationService.isNull(description, 'Miêu tả chương trình')) {
      return;
    }
    if (this.validationService.isNull(learningOutcome, 'Kết quả đạt được')) {
      return;
    }

    // check invalid
    if (
      this.validationService.isInvalidInput(curriculumCode, 'Mã chương trình')
    ) {
      return;
    }
    if (
      this.validationService.isInvalidInput(curriculumName, 'Tên chương trình')
    ) {
      return;
    }
    if (
      this.validationService.isInvalidTextArea(
        description,
        'Miêu tả chương trình'
      )
    ) {
      return;
    }
    if (
      this.validationService.isInvalidTextArea(
        learningOutcome,
        'Kết quả đạt được'
      )
    ) {
      return;
    }
    // 03/12/2021 QuangHN Add Validation for create curriculum END

    const request: CurriculumResponseArray = {
      curriculumId: 1,
      curriculumCode: this.form.controls.code.value,
      curriculumName: this.form.controls.name.value,
      description: this.form.controls.description.value,
      learningOutcome: this.form.controls.learningOutcome.value,
    };
    this.isLoading = true;
    this.api.createCurriculum(request).subscribe(
      (response: boolean) => {
        this.isLoading = false;
        if (response) {
          this.callAlert('Ok', 'Tạo mới thành công');
          setTimeout(() => {
            this.goBack();
          }, 1000);
        } else {
          this.callAlert(
            'Ok',
            'Mã chương trình/ Tên chương trình đã có. Vui lòng thử lại'
          );
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi tạo mới, vui lòng thử lại');
      }
    );
  }

  //getListSubject
  getListSubject(
    curriculumId: number,
    isAvailable: boolean,
    pageNo: number,
    pageSize: number
  ): void {
    this.isLoading = true;
    this.api
      .getSubjectByCurriculumId(curriculumId, isAvailable, pageNo, pageSize)
      .subscribe(
        (response: SubjectArray) => {
          this.subject = response;
          this.subjectArray = response.subjectsResponseDto;
          this.totalPage = this.subject.totalPage;
          this.currentPage = this.subject.pageNo;
          this.pageArray = Array(this.totalPage)
            .fill(1)
            .map((x, i) => i + 1)
            .reverse();
          this.isLoading = false;
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
          this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
          this.isLoading = false;
        }
      );
  }

  createSubject(): void {
    this.service.set('message', 'createSubject');
    this.router.navigate(['/dashboard/detail-subject']);
  }

  deleteSubject(): void {
    this.isLoading = true;
    this.api.deleteSubject(this.clickId).subscribe(
      (response: boolean) => {
        this.isLoading = false;
        if (response) {
          this.callAlert('Ok', 'Xóa thành công');
          setTimeout(() => {
            if (this.curriculumId) {
              this.getListSubject(this.curriculumId, true, 1, 5);
            }
          }, 1000);
        } else {
          this.callAlert('Ok', 'Mã môn học không tồn tại, vui lòng thử lại');
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi xóa, vui lòng thử lại');
      }
    );
  }

  changePage(page: number): void {
    if (this.curriculumId) {
      this.getListSubject(this.curriculumId, true, page, 5);
    }
  }

  goToDetailSubject(subjectId: any): void {
    this.service.set('message', 'editSubject');
    this.service.set('data', subjectId);
    this.router.navigate(['/dashboard/detail-subject']);
  }

  doYes(): void {
    if (this.alertMessage === 'Bạn có muốn xóa môn học này không ?') {
      this.deleteSubject();
    } else {
      if (this.curriculum) {
        this.curriculum.isAvailable = true;
      }
      this.editCurriculum();
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
    this.clickId = param;
  }
}
