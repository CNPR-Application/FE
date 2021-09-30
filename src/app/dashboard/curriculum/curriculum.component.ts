import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  CurriculumResponse,
  CurriculumResponseArray,
} from 'src/interfaces/Curriculum';
import { Subject, SubjectArray } from 'src/interfaces/Subject';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.scss'],
})
export class CurriculumComponent implements OnInit {
  constructor(
    private service: ApiService,
    private router: Router,
    private sharingService: LocalStorageService
  ) {}
  curriculumResponse?: CurriculumResponse;
  curriculumArray: Array<CurriculumResponseArray> | undefined;
  totalPage?: number;
  currentPage?: number;
  pageArray?: Array<number>;
  isLoading: boolean = true;
  keyCurriculum: string = '';
  clickId: number = 0;
  isAvailable: boolean = true;

  // subject
  subjectResponse?: SubjectArray;
  subjectArray: Array<Subject> | undefined;
  totalSubPage?: number;
  currentSubPage?: number;
  pageSubArray?: Array<number>;
  keySubject: string = '';
  clickIdSubject: number = 0;
  isAvailableSubject: boolean = true;

  //status delete

  ngOnInit(): void {
    this.getCurriculum(1, '', true);
  }

  changePage(page: number): void {
    if (this.keyCurriculum === '') {
      this.getCurriculum(page, '', this.isAvailable, true);
    } else {
      this.getCurriculum(page, this.keyCurriculum, this.isAvailable, true);
    }
  }

  getCurriculum(
    page: number,
    name: string,
    isAvailable: boolean,
    isSearch?: boolean
  ): void {
    this.isLoading = true;
    this.service.getCurriculumByName(name, isAvailable, page, 5).subscribe(
      (response: CurriculumResponse) => {
        this.curriculumResponse = response;
        this.curriculumArray = this.curriculumResponse.curriculumResponseDtos;
        this.totalPage = this.curriculumResponse.pageTotal;
        this.currentPage = this.curriculumResponse.pageNo;
        this.pageArray = Array(this.totalPage)
          .fill(1)
          .map((x, i) => i + 1)
          .reverse();
        if (!isSearch) {
          this.getSubjectByName('', true, 1, 10);
        } else {
          this.isLoading = false;
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
      }
    );
  }

  viewDeletedCurriculum(): void {
    if (this.isAvailable) {
      this.getCurriculum(1, '', false, true);
      this.isAvailable = false;
    }
  }

  viewCurrentCurriculum(): void {
    if (!this.isAvailable) {
      this.getCurriculum(1, '', true, true);
      this.isAvailable = true;
    }
  }

  searchCurriculum(): void {
    this.getCurriculum(1, this.keyCurriculum, this.isAvailable, true);
  }

  goToDetail(curriculumId: any): void {
    if (this.isAvailable) {
      this.sharingService.set('data', curriculumId);
      this.sharingService.set('message', 'editCurriculum');
      this.router.navigate(['/dashboard/detail-curriculum']);
    } else {
      this.sharingService.set('data', curriculumId);
      this.sharingService.set('message', 'undoCurriculum');
      this.router.navigate(['/dashboard/detail-curriculum']);
    }
  }

  createCurriculum(): void {
    this.sharingService.set('message', 'createCurriculum');
    this.router.navigate(['/dashboard/detail-curriculum']);
  }

  deleteCurriculum(): void {
    this.isLoading = true;
    this.service.deleteCurriculum(this.clickId).subscribe(
      (response: boolean) => {
        this.isLoading = false;
        if (response) {
          this.callAlert('Ok', 'Xóa thành công');
          setTimeout(() => {
            this.getCurriculum(1, '', this.isAvailable, true);
          }, 1000);
        } else {
          this.callAlert(
            'Ok',
            'Mã chương trình này đang có môn học. Vui lòng thử lại'
          );
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi xóa, vui lòng thử lại');
      }
    );
  }

  //subject
  searchSubject(): void {
    this.getSubjectByName(this.keySubject, this.isAvailableSubject, 1, 10);
  }

  createSubject(): void {
    this.sharingService.set('message', 'createSubject');
    this.router.navigate(['/dashboard/detail-subject']);
  }

  viewCurrentSubject(): void {
    if (!this.isAvailableSubject) {
      this.isAvailableSubject = true;
      this.getSubjectByName('', this.isAvailableSubject, 1, 10);
    }
  }
  viewDeletedSubject(): void {
    if (this.isAvailableSubject) {
      this.isAvailableSubject = false;
      this.getSubjectByName('', this.isAvailableSubject, 1, 10);
    }
  }

  getSubjectByName(
    name: string,
    isAvailable: boolean,
    pageNo: number,
    pageSize: number
  ): void {
    this.isLoading = true;
    this.service
      .getSubjectByName(name, isAvailable, pageNo, pageSize)
      .subscribe(
        (response: SubjectArray) => {
          this.subjectResponse = response;
          this.subjectArray = response.subjectsResponseDtos;
          this.totalSubPage = this.subjectResponse.pageTotal;
          this.currentSubPage = this.subjectResponse.pageNo;
          this.pageSubArray = Array(this.totalSubPage)
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

  goToDetailSubject(subjectId: any): void {
    if (this.isAvailableSubject) {
      this.sharingService.set('data', subjectId);
      this.sharingService.set('message', 'editSubject');
      this.router.navigate(['/dashboard/detail-subject']);
    } else {
      this.sharingService.set('data', subjectId);
      this.sharingService.set('message', 'undoSubject');
      this.router.navigate(['/dashboard/detail-subject']);
    }
  }

  changePageSub(pageNo: number): void {
    if (this.keySubject === '') {
      this.getSubjectByName('', this.isAvailableSubject, pageNo, 10);
    } else {
      this.getSubjectByName(
        this.keySubject,
        this.isAvailableSubject,
        pageNo,
        10
      );
    }
  }

  deleteSubject(): void {
    this.isLoading = true;
    this.service.deleteSubject(this.clickId).subscribe(
      (response: boolean) => {
        this.isLoading = false;
        if (response) {
          this.callAlert('Ok', 'Xóa thành công');
          setTimeout(() => {
            this.getSubjectByName('', true, 1, 10);
          }, 1000);
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

  //alert
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  doYes(): void {
    if (this.alertMessage === 'Bạn có muốn xóa chương trình này không ?') {
      this.deleteCurriculum();
    } else {
      this.deleteSubject();
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
      this.clickId = param;
    }
  }
}
