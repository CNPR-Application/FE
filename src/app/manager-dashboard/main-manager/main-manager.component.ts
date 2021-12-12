import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginResponse } from 'src/interfaces/Account';
import { ClassResponse, ClassArray } from 'src/interfaces/Class';
import { ShiftArray, Shift } from 'src/interfaces/Shift';
import { ManagerStatistic } from 'src/interfaces/Statistic';
import { SubjectArray, Subject } from 'src/interfaces/Subject';
import { TeacherArray, TeacherInfo } from 'src/interfaces/Teacher';
import { SingleChartClass, Single_Chart } from 'src/interfaces/Utils';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';

@Component({
  selector: 'app-main-manager',
  templateUrl: './main-manager.component.html',
  styleUrls: ['./main-manager.component.scss'],
})
export class MainManagerComponent implements OnInit {
  constructor(
    private localStorage: LocalStorageService,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    let user: LoginResponse = this.localStorage.get('user');
    this.branchId = user.branchId;
    this.isLoadingSubject = true;
    this.todayMonth = formatDate(this.today, 'yyyy-MM', 'en-US');
    this.getManagerStatistic();
    this.api.getSubjectByName('', true, 1, 1000).subscribe(
      (response: SubjectArray) => {
        this.subjectList = response.subjectsResponseDto;
        this.isLoadingSubject = false;
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
        if (this.subjectList) {
          this.processSubjectRating(this.subjectList);
        }
      },
      (error) => {
        this.isLoadingSubject = false;
        this.callAlert(
          'Ok',
          'Có lỗi xảy ra khi tải môn học, vui lòng thử lại',
          'close'
        );
      }
    );
    if (this.branchId) {
      this.searchClass(
        this.subjectId,
        this.branchId,
        this.shiftId,
        'waiting',
        1
      );
    }
    this.getTeacher(1);
    for (let i = 0; i < 5; i++) {
      this.ratingArr.push(i);
    }
  }

  chartArray?: Array<Single_Chart>;
  colorScheme = {
    domain: ['#aaece5', '#b3d7f3', '#ffe6b1', '#c3cdd7', '#e3c5d5'],
  };
  blueScheme = {
    domain: ['#96BAFF', '#7DEDFF', '#7C83FD', '#14279B', '#F5FDB0'],
  };
  colorArray: string[] = [
    '#aaece5',
    '#b3d7f3',
    '#ffe6b1',
    '#c3cdd7',
    '#e3c5d5',
  ];
  blueArray: string[] = ['#96BAFF', '#7DEDFF', '#7C83FD', '#14279B', '#F5FDB0'];

  //class opening
  classArray?: Array<ClassResponse>;
  //paging
  totalPage?: number;
  currentPage?: number;
  pageArray?: Array<number>;

  //for search
  statusClass: string = 'waiting';
  subjectId: number = 0;
  shiftId: number = 0;
  //dropdown
  subjectList?: Array<Subject>;
  shiftList?: Array<Shift>;

  branchId?: number;
  isLoadingClass: boolean = false;
  today = new Date();
  todayMonth: string = '2021-12';
  //subject array
  subjectArray?: Single_Chart[];
  preSubjectArray?: SingleChartClass[];
  //shift array
  shiftArray?: Single_Chart[];
  preShiftArray?: SingleChartClass[];
  //
  single: Single_Chart[] = [];

  //for rating
  ratingArr: Array<number> = [];

  //array
  subjectRatingArray?: Array<Subject>;
  teacherArray?: Array<TeacherInfo>;

  //loading
  isLoadingSubject: boolean = true;
  isLoadingTeacher: boolean = true;
  isLoadingStatic: boolean = false;

  totalPageTeacher?: number;
  currentPageTeacher?: number;
  pageArrayTeacher?: Array<number>;

  //chart
  chartArraySubject?: Array<Single_Chart>;
  chartArrayTeacher?: Array<Single_Chart>;

  getManagerStatistic() {
    let date = this.todayMonth + '-01';
    if (this.branchId) {
      this.isLoadingStatic = true;
      this.api.getManagerStatistic(date, this.branchId).subscribe(
        (response: ManagerStatistic) => {
          this.single = [
            {
              name: 'Đơn Tư Vấn Mới',
              value: response.newRegisteredInfo,
            },
            {
              name: 'Bookings Mới',
              value: response.newBooking,
            },
            {
              name: 'Học Sinh Mới',
              value: response.newStudent,
            },
            {
              name: 'Lớp Học Mới',
              value: response.newClass,
            },
            {
              name: 'Học Phí Thu Mới',
              value: response.monthRevenue,
            },
            {
              name: 'Tổng Bookings',
              value: response.totalBooking,
            },
            {
              name: 'Tổng Học Sinh',
              value: response.totalStudent,
            },
            {
              name: 'Tổng Lớp Học',
              value: response.totalClass,
            },
          ];
          this.isLoadingStatic = false;
        },
        (error) => {
          this.isLoadingStatic = false;
          this.callAlert(
            'Ok',
            'Có lỗi xảy ra khi tải số liệu, vui lòng thử lại',
            'close'
          );
        }
      );
    }
  }

  onChangeDate(value: string){
    this.todayMonth = value;
    this.getManagerStatistic();
  }

  onChangeSubject(subjectId: string) {
    this.subjectId = +subjectId;
    if (this.branchId) {
      this.searchClass(
        this.subjectId,
        this.branchId,
        this.shiftId,
        this.statusClass,
        1
      );
    }
  }

  onChangeShift(shiftId: string) {
    this.shiftId = +shiftId;
    if (this.branchId) {
      this.searchClass(
        this.subjectId,
        this.branchId,
        this.shiftId,
        this.statusClass,
        1
      );
    }
  }

  searchClass(
    subjectId: number,
    branchId: number,
    shiftId: number,
    status: string,
    pageNo: number
  ): void {
    this.isLoadingClass = true;
    this.api
      .searchClassBySubjectAndShift(
        branchId,
        subjectId,
        shiftId,
        status,
        pageNo,
        1000
      )
      .subscribe(
        (response: ClassArray) => {
          this.classArray = response.classList;
          if (this.classArray) {
            this.processSubjectArray(this.classArray);
            this.processShiftArray(this.classArray);
          }
          this.chartArray = [];
          this.classArray?.forEach((y) => {
            let item: Single_Chart = {
              name: y.className,
              value: y.numberOfStudent,
            };
            this.chartArray?.push(item);
          });
          this.totalPage = response.totalPage;
          this.pageArray = Array(this.totalPage)
            .fill(1)
            .map((x, i) => i + 1)
            .reverse();
          this.currentPage = response.pageNo;
          this.isLoadingClass = false;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.isLoadingClass = false;
          this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
        }
      );
  }

  processSubjectArray(classArray: ClassResponse[]) {
    this.preSubjectArray = [];
    this.subjectArray = [];
    if (classArray[0].subjectName && classArray[0].numberOfStudent) {
      this.preSubjectArray.push(
        new SingleChartClass(
          classArray[0].subjectName,
          classArray[0].numberOfStudent
        )
      );
      classArray.forEach((c) => {
        let cTest = this.preSubjectArray?.find((s) => s.name == c.subjectName);
        if (cTest) {
          if (c.numberOfStudent) {
            cTest.value += c.numberOfStudent;
          }
        } else {
          if (c.subjectName && c.numberOfStudent) {
            let item = new SingleChartClass(c.subjectName, c.numberOfStudent);
            this.preSubjectArray?.push(item);
          }
        }
      });
      this.preSubjectArray.forEach((x) => {
        let item: Single_Chart = {
          name: x.name,
          value: x.value,
        };
        this.subjectArray?.push(item);
      });
    }
  }

  processShiftArray(classArray: ClassResponse[]) {
    this.preShiftArray = [];
    this.shiftArray = [];
    if (classArray[0].shiftDescription && classArray[0].numberOfStudent) {
      this.preShiftArray.push(
        new SingleChartClass(
          classArray[0].shiftDescription,
          classArray[0].numberOfStudent
        )
      );
      classArray.forEach((c) => {
        let cTest = this.preShiftArray?.find(
          (s) => s.name == c.shiftDescription
        );
        if (cTest) {
          if (c.numberOfStudent) {
            cTest.value += c.numberOfStudent;
          }
        } else {
          if (c.shiftDescription && c.numberOfStudent) {
            let item = new SingleChartClass(
              c.shiftDescription,
              c.numberOfStudent
            );
            this.preShiftArray?.push(item);
          }
        }
      });
      this.preShiftArray.forEach((x) => {
        let item: Single_Chart = {
          name: x.name,
          value: x.value,
        };
        this.shiftArray?.push(item);
      });
    }
  }

  changePage(pageNo: number) {
    if (this.branchId) {
      this.searchClass(
        this.subjectId,
        this.branchId,
        this.shiftId,
        this.statusClass,
        pageNo
      );
    }
  }

  processSubjectRating(arr: Subject[]) {
    this.subjectRatingArray = arr?.sort(
      (a, b) => this.toFloat(b.rating) - this.toFloat(a.rating)
    );
    this.chartArraySubject = [];
    this.subjectRatingArray?.forEach((y) => {
      if (y && y.rating) {
        let num = this.toFloat(y.rating);
        let item: Single_Chart = {
          name: y.subjectName,
          value: num,
        };
        this.chartArraySubject?.push(item);
      }
    });
    this.chartArraySubject = this.chartArraySubject.slice(0, 10);
    this.subjectRatingArray = this.subjectRatingArray.slice(0, 10);
  }

  toFloat(x: number): number {
    let string = '' + x;
    string.replace(',', '.');
    return Math.floor(parseFloat(string));
  }

  getTeacher(pageNo: number): void {
    this.isLoadingTeacher = true;
    if (this.branchId)
      this.api
        .searchTeacherByBranchSubject(this.branchId, 0, pageNo, 1000)
        .subscribe(
          (response: TeacherArray) => {
            this.teacherArray = response.teacherInBranchList;
            this.teacherArray = this.teacherArray?.sort(
              (a, b) =>
                this.toFloat(b.teacherRating) - this.toFloat(a.teacherRating)
            );
            this.chartArrayTeacher = [];
            this.teacherArray?.forEach((y) => {
              if (y && y.teacherRating) {
                let num = this.toFloat(y.teacherRating);
                let item: Single_Chart = {
                  name: y.teacherName,
                  value: num,
                };
                this.chartArrayTeacher?.push(item);
              }
            });
            this.chartArrayTeacher = this.chartArrayTeacher.slice(0, 10);
            if (this.teacherArray) {
              this.teacherArray = this.teacherArray.slice(0, 10);
            }
            this.isLoadingTeacher = false;
          },
          (error) => {
            console.error(error);
            this.isLoadingTeacher = false;
            this.callAlert(
              'Ok',
              'Có lỗi xảy ra khi tải giáo viên, vui lòng thử lại'
            );
          }
        );
  }

  showIcon(index: number, rating: number | undefined) {
    if (rating) {
      let num: number = this.toFloat(rating);
      if (num >= index + 1) {
        return '#ffd740';
      } else {
        return 'rgba(216, 216, 216, 0.41)';
      }
    }
    return 'rgba(216, 216, 216, 0.41)';
  }

  showIconString(index: number, rating: string | undefined) {
    if (rating) {
      let num: number = this.toFloat(+rating);
      if (num >= index + 1) {
        return '#ffd740';
      } else {
        return 'rgba(216, 216, 216, 0.41)';
      }
    }
    return 'rgba(216, 216, 216, 0.41)';
  }

  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  doNo(): void {
    this.haveAlertYN = false;
  }

  doOk(): void {
    this.haveAlertOk = false;
  }

  callAlert(type: string, message: string, param?: any) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
    }
  }
}
