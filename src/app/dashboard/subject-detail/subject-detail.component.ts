import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
import { MatDialog } from '@angular/material/dialog';
import { SubjectDialogComponent } from 'src/app/dashboard/subject-detail/subject-dialog/subject-dialog.component';

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
    private dialog: MatDialog
  ) {}
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
        this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/dashboard/curriculum']);
  }

  editSubject(): void {
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
      image: 'image',
      isAvailable: this.subject?.isAvailable,
    };
    this.isLoading = true;
    this.api.updateSubject(request).subscribe(
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
          this.callAlert('Ok', 'Tên môn học đã tồn tại. Vui lòng thử lại');
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi chỉnh sửa, vui lòng thử lại');
      }
    );
  }

  createSubject(): void {
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
      image: 'image',
      isAvailable: this.subject?.isAvailable,
    };
    this.isLoading = true;
    this.api.createSubject(request).subscribe(
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
            'Mã môn học/ Tên môn học đã có. Vui lòng thử lại'
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
          this.totalPage = this.subjectDetail.pageTotal;
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
          this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
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
          this.callAlert('Ok', 'Xóa thành công');
          if (this.subjectId) {
            this.getListSubjectDetail(this.subjectId, true, 1, 5);
          }
        } else {
          this.callAlert('Ok', 'Mã môn học không tồn tại. Vui lòng thử lại');
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
    if (this.subjectId) {
      this.getListSubjectDetail(this.subjectId, true, page, 5);
    }
  }

  doYes(): void {
    if (this.alertMessage === 'Bạn có muốn xóa nội dung học tuần này không ?') {
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
