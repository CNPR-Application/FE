import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginResponse } from 'src/app/interfaces/Account';
import {
  ClassActivationRequest,
  ClassRequest,
  ClassResponse,
} from 'src/app/interfaces/Class';
import { TeacherArray, TeacherInfo } from 'src/app/interfaces/Teacher';
import { BookingPerClass, Single_Chart } from 'src/app/interfaces/Utils';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  StudentInClass,
  StudentInClassArray,
} from 'src/app/interfaces/StudentInClass';

@Component({
  selector: 'app-class-suggestion',
  templateUrl: './class-suggestion.component.html',
  styleUrls: ['./class-suggestion.component.scss'],
})
export class ClassSuggestionComponent implements OnInit {
  constructor(
    private api: ApiService,
    private localStorage: LocalStorageService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {}

  classModel?: ClassResponse;
  classId?: number;
  branchId?: number;
  isOptimize: boolean = false;
  //paging
  totalPage?: number;
  currentPage?: number;
  pageArray?: Array<number>;
  isLoading: boolean = false;

  MAX_CLASS_NUM: number = 12;
  MIN_CLASS_NUM: number = 8;

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
  clickedId?: string;
  today: string | null = '';

  //booking
  studentArray?: Array<StudentInClass>; // array of all bookings ( not process )
  studentPerClassArray?: Array<StudentInClass>; // array of current clicked booking
  studentPerClassObject?: BookingPerClass; // object of current clicked booking
  allStudentPerClassObjectArray?: Array<BookingPerClass>; // array of all array of booking ( after process )
  clickedItemChart?: Single_Chart;
  isDisplayStudent: boolean = false;
  numberOfStudentPerClass: number = 0;
  teacherArray?: Array<TeacherInfo>;

  // activate
  activateClassArray: Array<BookingPerClass> = [];
  isLoadingInner: boolean = false;
  isDisplayActivateButton: boolean = true;

  ngOnInit(): void {
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.classModel = this.localStorage.get('class');
    this.classId = this.classModel?.classId;
    this.getBookingList();
    this.getTeacherList();
    this.getStartChart();
    this.initForm();
  }

  initForm(): void {
    let user: LoginResponse = this.localStorage.get('user');
    if (this.clickedItemChart?.label) {
      this.clickedId = this.clickedItemChart?.label;
    }
    this.form.controls.id.setValue(this.classModel?.classId);
    this.form.controls.name.setValue(this.classModel?.className);
    this.form.controls.slot.setValue(this.classModel?.slot);
    this.form.controls.managerUsername.setValue(user.username);
    this.form.controls.subjectId.setValue(this.classModel?.subjectName);
    this.form.controls.shiftId.setValue(this.classModel?.shiftDescription);
    this.form.controls.roomNo.setValue(this.classModel?.roomNo);
    this.openingDate = this.classModel?.openingDate;
  }

  getBookingList(): void {
    this.isLoadingInner = true;
    if (this.classId) {
      this.api.getStudentInClass(this.classId, 1, 1000).subscribe(
        (data: StudentInClassArray) => {
          this.studentArray = data.studentInClassSearchResponseDtos;
          this.isLoadingInner = false;
          if (this.isDisplayStudent) {
            this.processBookingPerClass();
          }
        },
        (error) => {
          this.callAlert(
            'Ok',
            'Có lỗi xảy ra khi tải học sinh đăng ký, vui lòng thử lại'
          );
        }
      );
    }
  }

  getTeacherList(): void {
    let user: LoginResponse = this.localStorage.get('user');
    this.branchId = user.branchId;
    if (this.branchId && this.classModel?.subjectId) {
      this.api
        .searchTeacher(this.branchId, this.classModel?.subjectId, 1, 1000)
        .subscribe(
          (data: TeacherArray) => {
            this.teacherArray = data.teacherList;
          },
          (error) => {
            this.callAlert(
              'Ok',
              'Có lỗi xảy ra khi tải danh sách giáo viên, vui lòng thử lại'
            );
          }
        );
    }
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
      if (numOfStudent >= this.MIN_CLASS_NUM) {
        var numClass = Math.floor(numOfStudent / this.MIN_CLASS_NUM);
        while (numClass > 0) {
          let item: Single_Chart = {
            name: 'Lớp ' + i,
            value: this.MIN_CLASS_NUM,
          };
          i++;
          numClass--;
          this.chartArray.push(item);
        }
      }
      var remainder = numOfStudent % this.MIN_CLASS_NUM;
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
  }

  optimizeClass() {
    var chartArrayAfter: Array<Single_Chart> = [];
    if (this.classModel?.numberOfStudent) {
      var numOfStudent: number = this.classModel?.numberOfStudent;
      if (numOfStudent >= this.MAX_CLASS_NUM) {
        var minclass = Math.floor(numOfStudent / this.MAX_CLASS_NUM);
        var remainder = numOfStudent % this.MAX_CLASS_NUM;
        var optionalStudents = 4 * minclass;
        var needingStudent = this.MIN_CLASS_NUM - remainder;
        if (
          remainder >= this.MIN_CLASS_NUM ||
          (remainder < this.MIN_CLASS_NUM && optionalStudents >= needingStudent)
        ) {
          if (remainder != 0) {
            minclass += 1;
          }
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
        } else {
          var i: number = 1;
          while (minclass > 0) {
            let item: Single_Chart = {
              name: 'Lớp ' + i,
              value: this.MAX_CLASS_NUM,
            };
            chartArrayAfter.push(item);
            i++;
            minclass--;
          }
          if (remainder != 0) {
            let item: Single_Chart = {
              name: 'Lớp ' + i,
              value: remainder,
            };
            chartArrayAfter.push(item);
          }
        }
      } else if (
        numOfStudent > this.MIN_CLASS_NUM &&
        numOfStudent < this.MAX_CLASS_NUM
      ) {
        let item: Single_Chart = {
          name: 'Lớp 1',
          value: numOfStudent,
        };
        chartArrayAfter.push(item);
      }
      this.isOptimize = true;
      if (chartArrayAfter.length > 0) {
        this.chartArray = chartArrayAfter;
      }
      this.xAxisLabel =
        'Tổng sau tối ưu : ' +
        numOfStudent +
        ' học sinh & ' +
        this.chartArray.length +
        ' lớp';
    }
    this.allStudentPerClassObjectArray = undefined;
    this.isDisplayStudent = false;
  }

  undoOptimize() {
    this.allStudentPerClassObjectArray = undefined;
    this.getStartChart();
    this.isOptimize = false;
    this.isDisplayStudent = false;
  }

  onSelect(data: any): void {
    this.isDisplayActivateButton = true;
    this.clickedItemChart = JSON.parse(JSON.stringify(data));
    if (!this.allStudentPerClassObjectArray) {
      this.processBookingPerClass();
    } else {
      this.allStudentPerClassObjectArray.forEach((o: BookingPerClass) => {
        if (o.label == this.clickedItemChart?.name) {
          this.studentPerClassArray = o.studentPerClassArray;
          this.numberOfStudentPerClass = o.numberOfStudent;
          this.studentPerClassObject = o;
        }
      });
    }
    this.initForm();
    this.isDisplayStudent = true;
    this.activateClassArray?.forEach((x) => {
      if (x.label == this.clickedItemChart?.name && x.isActivated != 2) {
        this.isDisplayActivateButton = false;
      } else if (x.label == this.clickedItemChart?.name && x.isActivated == 2) {
        this.studentPerClassObject?.setIsActivated(0);
      }
    });
    if (this.studentPerClassArray) {
      if (
        this.studentPerClassArray?.length <= 4 ||
        this.studentPerClassArray.length >= 16
      ) {
        this.isDisplayActivateButton = false;
      }
    }
    if (this.isOpeningChangeStudentFrame) {
      this.openChangeStudentFrame();
    }
  }

  processBookingPerClass() {
    let startIndex: number = 0;
    let endIndex: number = 0;
    this.allStudentPerClassObjectArray = [];
    for (let i = 0; i < this.chartArray.length; i++) {
      let item: Single_Chart = this.chartArray[i];
      if (i != 0) {
        startIndex = endIndex + 1;
        if (item.value) {
          endIndex += item.value;
        }
      } else if (i == 0) {
        startIndex = 0;
        if (item.value) {
          endIndex += item.value - 1;
        }
      }
      if (this.studentArray && item.name) {
        let array = new Array<StudentInClass>();
        if (startIndex != endIndex) {
          array = this.studentArray?.slice(startIndex, endIndex + 1);
        } else {
          array.push(this.studentArray[startIndex]);
        }
        this.colorIndex = i % 5;
        let o = new BookingPerClass(
          item.name,
          endIndex - startIndex + 1,
          array,
          false,
          false,
          0,
          this.colorArray[this.colorIndex]
        );
        if (item.name == this.clickedItemChart?.name) {
          this.studentPerClassArray = array;
          this.numberOfStudentPerClass = endIndex - startIndex + 1;
          this.studentPerClassObject = o;
        }
        this.allStudentPerClassObjectArray.push(o);
      }
    }
  }

  // change student list per class
  changeClickedObject?: BookingPerClass; //object of current click in change frame
  changeClickedArray?: Array<StudentInClass>; //object of current click in change frame
  allChangeObjectArray?: Array<BookingPerClass>; // array of all array of booking ( after process ) in change frame
  isChosenObjectArray?: Array<BookingPerClass>;

  isOpeningChangeStudentFrame = false;
  colorIndex: number = 5;
  colorArray: Array<string> = [
    'rgb(170, 236, 229,0.7)',
    'rgb(179, 215, 243,0.7)',
    'rgb(195,205,215,0.7)',
    'rgb(255,230,177,0.7)',
    'rgb(227,197,213,0.7)',
  ];

  openChangeStudentFrame(): void {
    this.isChosenObjectArray = [];
    this.allChangeObjectArray = [];
    this.changeClickedArray = [];
    if (this.studentPerClassObject) {
      this.changeClickedObject = this.studentPerClassObject;
      this.changeClickedArray =
        this.changeClickedObject.getStudentPerClassArray();
    }
    if (this.allStudentPerClassObjectArray) {
      this.allChangeObjectArray = this.allStudentPerClassObjectArray;
      this.allStudentPerClassObjectArray.forEach((x) => {
        if (x.label != this.studentPerClassObject?.label) {
          this.isChosenObjectArray?.push(x);
        }
      });
    }
    this.isOpeningChangeStudentFrame = true;
  }

  closeChangeStudentFrame(): void {
    this.isOpeningChangeStudentFrame = false;
  }

  getBackgroundColor(): string | undefined {
    return this.studentPerClassObject?.color;
  }

  drop(event: CdkDragDrop<StudentInClass[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if (this.changeClickedArray)
        moveItemInArray(
          this.changeClickedArray,
          event.previousIndex,
          event.currentIndex
        );
    }
  }

  //activate class
  activateClass() {
    let form1: FormGroup = this.form;
    let studentPerClassArray: Array<StudentInClass> | undefined =
      this.studentPerClassArray;
    let studentPerClassObject: BookingPerClass | undefined =
      this.studentPerClassObject;
    let index: number = 0;
    // get id student
    let bookingNumberArray: Array<number> = [];
    studentPerClassArray?.forEach((x) => bookingNumberArray.push(x.bookingId));
    // thêm lớp hiện tại vào mảng activate
    if (studentPerClassObject) {
      this.activateClassArray.push(studentPerClassObject);
      index = this.activateClassArray.length - 1;
    }
    // nếu k phải là phần tử cuối cùng thì tạo lớp
    // if (
    //   this.clickedItemChart?.name !=
    //   this.allStudentPerClassObjectArray[
    //     this.allStudentPerClassObjectArray?.length - 1
    //   ].label
    // ) {
    //   this.create(index, form1, this.bookingNumberArray);
    // } else {
    //   this.studentPerClassObject.setIsCreateClass(true);
    //   if (this.classId) {
    //     this.activateStepFinal(index, form1, this.classId);
    //   }
    // }
    this.create(index, form1, bookingNumberArray);
  }

  create(
    index: number,
    form: FormGroup,
    bookingNumberArray: Array<number>
  ): void {
    let classId: number | undefined;
    let user: LoginResponse = this.localStorage.get('user');
    console.log(form);
    const request: ClassRequest = {
      className: form.controls.name.value,
      shiftId: this.classModel?.shiftId,
      subjectId: this.classModel?.subjectId,
      branchId: this.branchId,
      openingDate: form.controls.openingDate.value,
      creator: user.username,
      roomNo: +form.controls.roomNo.value,
    };
    this.api.createClass(request).subscribe(
      (response: ClassResponse) => {
        classId = response.classId;
        this.activateClassArray[index].setIsCreateClass(true);
        console.log('after create class, classIdInProcess: ' + classId);
        console.log(
          'after create class, isCreateClass: ' +
            this.activateClassArray[index].isCreateClass
        );
        if (classId)
          this.activateStepFinal(index, form, classId, bookingNumberArray);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.activateClassArray[index].setIsActivated(2);
        if (error.error === 'Class Name is null or empty!') {
          this.callAlert('Ok', 'Tên lớp không được để trống');
        } else if (error.error === 'Opening Day must be a day in Shift!') {
          this.callAlert(
            'Ok',
            'Ngày khai giảng phải là ngày thuộc ca học đã chọn !'
          );
        } else {
          this.callAlert(
            'Ok',
            'Có lỗi xảy ra khi tạo mới lớp vui lòng thử lại'
          );
        }
      }
    );
  }

  activateStepFinal(
    index: number,
    form: FormGroup,
    classId: number,
    bookingNumberArray: Array<number>
  ): void {
    if (this.activateClassArray[index])
      if (this.activateClassArray[index].isCreateClass) {
        const request: ClassActivationRequest = {
          roomNo: +form.controls.roomNo.value,
          teacherId: +form.controls.teacherName.value,
          classId: classId,
          creator: form.controls.managerUsername.value,
          bookingIdList: bookingNumberArray,
        };
        this.api.activateClass(request).subscribe(
          (response: boolean) => {
            if (response) {
              if (this.activateClassArray[index]) {
                this.activateClassArray[index].setIsMovedStudent(true);
                this.activateClassArray[index].setIsActivated(1);
              }
            }
          },
          (error) => {
            console.log(error);
            this.activateClassArray[index].setIsActivated(2);
            this.callAlert(
              'Ok',
              'Có lỗi xảy ra khi tạo mới lớp vui lòng thử lại'
            );
          }
        );
      }
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
