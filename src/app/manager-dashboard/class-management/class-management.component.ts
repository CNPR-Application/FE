import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginResponse } from 'src/interfaces/Account';
import { ClassArray, ClassResponse, ClassStatus } from 'src/interfaces/Class';
import { NotiPersonRequest } from 'src/interfaces/Notification';
import { Shift, ShiftArray } from 'src/interfaces/Shift';
import { Subject, SubjectArray } from 'src/interfaces/Subject';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';
import { ClassCreateComponent } from './class-create/class-create.component';

@Component({
  selector: 'app-class-management',
  templateUrl: './class-management.component.html',
  styleUrls: ['./class-management.component.scss'],
})
export class ClassManagementComponent implements OnInit {
  constructor(
    private localStorage: LocalStorageService,
    private dialog: MatDialog,
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  today?: Date;
  name?: string;
  listTitle: string = 'Danh sách lớp chờ đăng ký';
  isLoading: boolean = true;
  classArray?: Array<ClassResponse>;
  branchId: number = 0;
  //paging
  totalPage?: number;
  currentPage?: number;
  pageArray?: Array<number>;
  //clickId
  clickedId: number = 0;
  //for search
  status: string = 'waiting';
  subjectId: number = 0;
  shiftId: number = 0;
  //dropdown
  subjectList?: Array<Subject>;
  shiftList?: Array<Shift>;
  //form
  form: FormGroup = this.formBuilder.group({
    id: [''],
    name: ['', Validators.required],
    openingDate: ['', Validators.required],
    subjectId: ['', Validators.required],
    shiftId: ['', Validators.required],
    status: ['Chờ mở lớp', Validators.required],
    teacherName: [''],
    roomNo: [''],
    slot: [''],
    managerUsername: [''],
  });
  openingDate?: string;
  //for status
  isLoadingStatus: boolean = true;
  dataStatistic?: ClassStatus;

  ngOnInit(): void {
    this.today = new Date();
    let user: LoginResponse = this.localStorage.get('user');
    this.name = user.name;
    if (user.branchId) {
      this.branchId = user.branchId;
    }
    this.isLoading = true;
    this.getClassAll(this.branchId, this.status, 1);
    this.api.getSubjectByName('', true, 1, 1000).subscribe(
      (response: SubjectArray) => {
        this.subjectList = response.subjectsResponseDto;
        this.api.getAllShift(1, 100, true).subscribe(
          (response: ShiftArray) => {
            this.shiftList = response.shiftDtos;
          },
          (error) => {
            this.callAlert(
              'Ok',
              'Có lỗi xảy ra khi tải ca học, vui lòng thử lại',
              'close'
            );
          }
        );
      },
      (error) => {
        this.callAlert(
          'Ok',
          'Có lỗi xảy ra khi tải môn học, vui lòng thử lại',
          'close'
        );
      }
    );
    this.api.getClassStatistic(this.branchId).subscribe(
      (data: ClassStatus) => {
        this.isLoadingStatus = false;
        this.dataStatistic = data;
      },
      (error) => {
        this.isLoadingStatus = false;
        this.callAlert(
          'Ok',
          'Có lỗi xảy ra khi tải thống kê dữ liệu, vui lòng thử lại',
          'close'
        );
      }
    );
  }

  goToClassSuggest(c: ClassResponse) {
    this.localStorage.set('class', c);
    this.router.navigateByUrl('/manager-dashboard/class-suggestion');
  }

  goToSessionPage(c: ClassResponse) {
    this.localStorage.set('class', c);
    this.router.navigateByUrl('/manager-dashboard/session');
  }

  changeTitle(name: string): void {
    this.listTitle = name;
    if (name === 'Danh sách lớp chờ đăng ký') {
      this.status = 'waiting';
      this.form.enable();
    } else if (name === 'Danh sách lớp đang học') {
      this.status = 'studying';
      this.form.disable();
    } else if (name === 'Danh sách lớp đã kết thúc') {
      this.status = 'finished';
      this.form.disable();
    }
    this.form.reset();
    this.getClassAll(this.branchId, this.status, 1);
  }

  onChangeSubject(subjectId: string) {
    this.subjectId = +subjectId;
    this.searchClass(
      this.subjectId,
      this.branchId,
      this.shiftId,
      this.status,
      1
    );
  }

  onChangeShift(shiftId: string) {
    this.shiftId = +shiftId;
    this.searchClass(
      this.subjectId,
      this.branchId,
      this.shiftId,
      this.status,
      1
    );
  }

  openCreateDialog(): void {
    let user: LoginResponse = this.localStorage.get('user');
    let dialogRef = this.dialog.open(ClassCreateComponent, {
      data: { branchId: user.branchId },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.getClassAll(this.branchId, this.status, 1);
      }
    });
  }

  openEditDialog(selectedClass: ClassResponse): void {
    let dialogRef = this.dialog.open(ClassCreateComponent, {
      data: { type: 'edit', class: selectedClass },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.getClassAll(this.branchId, this.status, 1);
      }
    });
  }

  searchClass(
    subjectId: number,
    branchId: number,
    shiftId: number,
    status: string,
    pageNo: number
  ): void {
    this.isLoading = true;
    this.api
      .searchClassBySubjectAndShift(
        branchId,
        subjectId,
        shiftId,
        status,
        pageNo,
        13
      )
      .subscribe(
        (response: ClassArray) => {
          this.classArray = response.classList;
          this.totalPage = response.totalPage;
          this.pageArray = Array(this.totalPage)
            .fill(1)
            .map((x, i) => i + 1)
            .reverse();
          this.currentPage = response.pageNo;
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.isLoading = false;
          this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
        }
      );
  }

  getClassAll(branchId: number, status: string, pageNo: number): void {
    this.isLoading = true;
    this.api.getClassByBranch(branchId, status, pageNo, 13).subscribe(
      (response: ClassArray) => {
        this.classArray = response.classList;
        this.totalPage = response.totalPage;
        this.pageArray = Array(this.totalPage)
          .fill(1)
          .map((x, i) => i + 1)
          .reverse();
        this.currentPage = response.pageNo;
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
      }
    );
  }

  changePage(pageNo: number) {
    this.searchClass(
      this.subjectId,
      this.branchId,
      this.shiftId,
      this.status,
      pageNo
    );
  }

  setFormDetail(c: ClassResponse) {
    if (c.classId) this.clickedId = c.classId;
    this.form.controls.id.setValue(c.classId);
    this.form.controls.name.setValue(c.className);
    this.openingDate = c.openingDate;
    this.form.controls.openingDate.setValue(c.openingDate);
    this.form.controls.subjectId.setValue(c.subjectId);
    this.form.controls.shiftId.setValue(c.shiftId);
    this.form.controls.status.setValue(c.status);
    this.form.controls.teacherName.setValue(c.teacherName);
    this.form.controls.roomNo.setValue(c.roomName);
    this.form.controls.slot.setValue(c.slot);
    this.form.controls.managerUsername.setValue(c.managerUsername);
  }

  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  doYes(): void {
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
    this.clickedId = param;
  }
}
