import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoginResponse } from 'src/interfaces/Account';
import { ClassResponse } from 'src/interfaces/Class';
import { AdminStatistic, AdminStatisticArray } from 'src/interfaces/Statistic';
import { Subject, SubjectArray } from 'src/interfaces/Subject';
import { SingleChartClass, Single_Chart } from 'src/interfaces/Utils';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';

@Component({
  selector: 'app-main-admin',
  templateUrl: './main-admin.component.html',
  styleUrls: ['./main-admin.component.scss'],
})
export class MainAdminComponent implements OnInit {
  constructor(
    private localStorage: LocalStorageService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.branchId = 1;
    this.isLoadingSubject = true;
    this.getAdminStatistic();
    this.api.getSubjectByName('', true, 1, 1000).subscribe(
      (response: SubjectArray) => {
        this.isLoadingSubject = false;
        if (response.subjectsResponseDto) {
          this.processSubjectRating(response.subjectsResponseDto);
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
    for (let i = 0; i < 5; i++) {
      this.ratingArr.push(i);
    }
  }

  chartArray?: Array<Single_Chart>;
  titleChartArray: string = 'Biểu đồ lớp học mới của các chi nhánh';
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

  branchId?: number;
  isLoadingClass: boolean = false;
  today = new Date();
  //subject array
  subjectArray?: Single_Chart[];
  preSubjectArray?: SingleChartClass[];
  //statisticarray
  statisticArray?: AdminStatistic[];
  //number card
  single: Single_Chart[] = [];

  //for rating
  ratingArr: Array<number> = [];

  //array
  subjectRatingArray?: Array<Subject>;

  //loading
  isLoadingSubject: boolean = true;
  isLoadingTeacher: boolean = true;
  isLoadingStatic: boolean = false;

  //chart
  chartArraySubject?: Array<Single_Chart>;

  getAdminStatistic() {
    let date = formatDate(this.today, 'yyyy-MM', 'en-US') + '-01';
    this.isLoadingStatic = true;
    this.api.getAdminStatistic(date).subscribe(
      (response: AdminStatisticArray) => {
        this.statisticArray = response.branchesStatisticResponseDtoList;
        this.onChangeSelector('class');
        this.single = [
          {
            name: 'Đơn Tư Vấn Mới',
            value: response.totalNewRegisteredInfo,
          },
          {
            name: 'Bookings Mới',
            value: response.totalNewBooking,
          },
          {
            name: 'Học Phí Thu Mới',
            value: response.totalMonthRevenue,
          },
          {
            name: 'Học Sinh Mới',
            value: response.totalNewStudent,
          },
          {
            name: 'Giáo Viên Mới',
            value: response.totalNewTeacher,
          },
          {
            name: 'Lớp Học Mới',
            value: response.totalNewClass,
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

  onChangeSelector(value: string) {
    if (this.statisticArray) {
      this.chartArray = [];
      if (value == 'class') {
        this.titleChartArray = 'Biểu đồ lớp học mới của các chi nhánh';
        this.statisticArray.forEach((x) => {
          let item: Single_Chart = {
            name: x.branchName,
            value: x.newClass,
          };
          this.chartArray?.push(item);
        });
      } else if (value == 'registeredInfo') {
        this.titleChartArray = 'Biểu đồ đơn tư vấn mới của các chi nhánh';
        this.statisticArray.forEach((x) => {
          let item: Single_Chart = {
            name: x.branchName,
            value: x.newRegisteredInfo,
          };
          this.chartArray?.push(item);
        });
      } else if (value == 'bookings') {
        this.titleChartArray = 'Biểu đồ bookings mới của các chi nhánh';
        this.statisticArray.forEach((x) => {
          let item: Single_Chart = {
            name: x.branchName,
            value: x.newBooking,
          };
          this.chartArray?.push(item);
        });
      } else if (value == 'student') {
        this.titleChartArray = 'Biểu đồ học sinh mới của các chi nhánh';
        this.statisticArray.forEach((x) => {
          let item: Single_Chart = {
            name: x.branchName,
            value: x.newStudent,
          };
          this.chartArray?.push(item);
        });
      } else if (value == 'teacher') {
        this.titleChartArray = 'Biểu đồ giáo viên mới của các chi nhánh';
        this.statisticArray.forEach((x) => {
          let item: Single_Chart = {
            name: x.branchName,
            value: x.newTeacher,
          };
          this.chartArray?.push(item);
        });
      } else if (value == 'revenue') {
        this.titleChartArray = 'Biểu đồ học phí thu mới của các chi nhánh';
        this.statisticArray.forEach((x) => {
          let item: Single_Chart = {
            name: x.branchName,
            value: x.monthRevenue,
          };
          this.chartArray?.push(item);
        });
      }
    }
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

  processSubjectRating(arr: Subject[]) {
    this.subjectRatingArray = arr?.sort(
      (a, b) => this.toFloatNum(b.rating) - this.toFloatNum(a.rating)
    );
    this.chartArraySubject = [];
    this.subjectRatingArray?.forEach((y) => {
      if (y && y.rating) {
        let num = this.toFloatNum(y.rating);
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

  toFloat(x: string | undefined): number {
    if (x) {
      x.replace(',', '.');
      return Math.floor(parseFloat(x));
    }
    return 0;
  }

  toFloatNum(x: number | undefined): number {
    if (x) {
      let y = '' + x;
      y.replace(',', '.');
      return Math.floor(parseFloat(y));
    }
    return 0;
  }

  showIcon(index: number, rating: number | undefined) {
    if (rating) {
      let num: number = Math.floor(rating);
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
      rating.replace(',', '.');
      let num: number = Math.floor(parseFloat(rating));
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
