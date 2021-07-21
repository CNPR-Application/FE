import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  ClassResponse,
  StudentInClass,
  StudentInClassArray,
} from 'src/app/models/Class';
import { Single_Chart } from 'src/app/models/Utils';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-class-suggestion',
  templateUrl: './class-suggestion.component.html',
  styleUrls: ['./class-suggestion.component.scss'],
})
export class ClassSuggestionComponent implements OnInit {
  constructor(
    private api: ApiService,
    private localStorage: LocalStorageService
  ) {}

  studentArray?: Array<StudentInClass>;
  classModel?: ClassResponse;
  classId?: number;
  isOptimize: boolean = false;
  //paging
  totalPage?: number;
  currentPage?: number;
  pageArray?: Array<number>;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.classModel = this.localStorage.get('class');
    this.classId = this.classModel?.classId;

    if (this.classId) {
      this.api.getStudentInClass(this.classId, 1, 1000).subscribe(
        (data: StudentInClassArray) => {
          this.studentArray = data.studentInClassSearchResponseDtos;
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.callAlert(
            'Ok',
            'Có lỗi xảy ra khi tải học sinh đăng ký, vui lòng thử lại'
          );
        }
      );
    }

    this.getStartChart();
  }

  //chart
  chartArray: Array<Single_Chart> = [];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Tổng số lượng ';
  yAxisLabel: string = 'Lớp';
  timeline: boolean = true;
  customColor = {
    domain: ['#498DD0'],
  };
  colorScheme = {
    domain: ['#aaece5', '#b3d7f3', '#c3cdd7', '#ffe6b1', '#e3c5d5'],
  };

  getStartChart(): void {
    // start chart
    if (this.classModel?.numberOfStudent) {
      var numOfStudent: number = this.classModel?.numberOfStudent;
      var i = 1;
      this.chartArray = [];
      if (numOfStudent >= 8) {
        var numClass = Math.floor(numOfStudent / 8);
        while (numClass > 0) {
          let item: Single_Chart = {
            name: 'Lớp ' + i,
            value: 8,
          };
          i++;
          numClass--;
          this.chartArray.push(item);
        }
      }
      var remainder = numOfStudent % 8;
      if (remainder > 0) {
        let item: Single_Chart = {
          name: 'Lớp ' + i,
          value: remainder,
        };
        this.chartArray.push(item);
      }
      this.xAxisLabel =
        'Tổng chưa tối ưu : ' +
        numOfStudent +
        ' học sinh & ' +
        this.chartArray.length +
        ' lớp';
    }

    //after chart
  }

  async optimizeClass() {
    var chartArrayAfter: Array<Single_Chart> = [];
    if (this.classModel?.numberOfStudent) {
      var numOfStudent: number = this.classModel?.numberOfStudent;
      var minclass = Math.floor(numOfStudent / 12);
      var remainder = numOfStudent % 12;
      if (remainder === 0) {
        var i: number = 1;
        while (minclass > 0) {
          let item: Single_Chart = {
            name: 'Lớp ' + i,
            value: 12,
          };
          chartArrayAfter.push(item);
          i++;
          minclass--;
        }
      } else if (remainder >= 8) {
        var i: number = 1;
        while (minclass > 0) {
          let item: Single_Chart = {
            name: 'Lớp ' + i,
            value: 12,
          };
          chartArrayAfter.push(item);
          i++;
          minclass--;
        }
        let item: Single_Chart = {
          name: 'Lớp ' + i,
          value: remainder,
        };
        chartArrayAfter.push(item);
      } else if (remainder > 0 && remainder < 8) {
        var optionalStudents = 4 * minclass;
        var needingStudent = 8 - remainder;
        if (optionalStudents < needingStudent) {
          let item1: Single_Chart = {
            name: 'Lớp ' + 1,
            value: 12,
          };
          let item2: Single_Chart = {
            name: 'Lớp ' + 2,
            value: remainder,
          };
          chartArrayAfter.push(item1);
          chartArrayAfter.push(item2);
        } else {
          minclass = minclass + 1;
          remainder = numOfStudent % minclass;
          var studentPerClass = Math.floor(numOfStudent / minclass);
          var i = 1;
          while (i <= remainder) {
            let item: Single_Chart = {
              name: 'Lớp ' + i,
              value: studentPerClass + 1,
            };
            i++;
            chartArrayAfter.push(item);
          }
          while (i <= minclass) {
            let item: Single_Chart = {
              name: 'Lớp ' + i,
              value: studentPerClass,
            };
            i++;
            chartArrayAfter.push(item);
          }
        }
      }
      this.xAxisLabel =
        'Tổng sau tối ưu : ' +
        numOfStudent +
        ' học sinh & ' +
        chartArrayAfter.length +
        ' lớp';
    }
    this.chartArray = chartArrayAfter;
    this.isOptimize = true;
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
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
  }
}
