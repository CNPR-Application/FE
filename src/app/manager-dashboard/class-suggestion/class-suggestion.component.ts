import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { DatePipe, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginResponse } from 'src/interfaces/Account';
import { Booking, BookingArray } from 'src/interfaces/Booking';
import {
  ClassActivationRequest, ClassResponse
} from 'src/interfaces/Class';
import { NotiClassRequest } from 'src/interfaces/Notification';
import { RoomResponse } from 'src/interfaces/Room';
import { TeacherInfo, TeacherSearchArray } from 'src/interfaces/Teacher';
import { Single_Chart } from 'src/interfaces/Utils';
import { ApiService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local-storage.service';
import { BookingPerClass } from './class-suggestion';

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
  studentArray?: Array<Booking>; // array of all bookings ( not process )
  studentPerClassArray?: Array<Booking>; // array of current clicked booking
  studentPerClassObject?: BookingPerClass; // object of current clicked booking
  allStudentPerClassObjectArray?: Array<BookingPerClass>; // array of all array of booking ( after process )
  clickedItemChart?: Single_Chart;
  isDisplayStudent: boolean = false;
  numberOfStudentPerClass: number = 0;
  teacherArray?: Array<TeacherInfo>;
  roomArray?: Array<RoomResponse>;

  // activate
  activateClassArray: Array<BookingPerClass> = [];
  isLoadingInner: boolean = false;
  isDisplayActivateButton: boolean = true;

  ngOnInit(): void {
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.classModel = this.localStorage.get('class');
    this.classId = this.classModel?.classId;
    this.branchId = this.classModel?.branchId;
    this.getBookingList();
    this.getTeacherList();
    this.optimizeClass();
    this.getRoomList();
    this.initForm();
  }

  initForm(
    classId?: number,
    className?: string,
    teacherId?: number,
    roomId?: number,
    openingDate?: string
  ): void {
    let user: LoginResponse = this.localStorage.get('user');
    if (this.clickedItemChart?.label) {
      this.clickedId = this.clickedItemChart?.label;
    }
    if (classId) {
      this.form.controls.id.setValue(classId);
    } else {
      this.form.controls.id.setValue(this.classModel?.classId);
    }
    if (className) {
      this.form.controls.name.setValue(className);
    } else {
      this.form.controls.name.setValue(this.classModel?.className);
    }
    this.form.controls.slot.setValue(this.classModel?.slot);
    this.form.controls.managerUsername.setValue(user.username);
    this.form.controls.subjectId.setValue(this.classModel?.subjectName);
    this.form.controls.shiftId.setValue(this.classModel?.shiftDescription);
    if (roomId) {
      this.form.controls.roomNo.setValue(roomId);
    } else {
      this.form.controls.roomNo.setValue(this.classModel?.roomId);
    }
    if (openingDate) {
      this.openingDate = openingDate;
    } else {
      this.openingDate = this.classModel?.openingDate;
    }
    if (teacherId) {
      this.form.controls.teacherId.setValue(teacherId);
    }
  }

  getBookingList(): void {
    this.isLoadingInner = true;
    if (this.classId) {
      this.api
        .searchBookingByClassIdAndStatus(this.classId, 'paid', 1, 1000)
        .subscribe(
          (data: BookingArray) => {
            this.studentArray = data.classList;
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

  getTeacherList(openingDate?: string): void {
    let user: LoginResponse = this.localStorage.get('user');
    this.branchId = user.branchId;

    if (
      this.branchId &&
      this.classModel?.subjectId &&
      this.classModel.openingDate &&
      this.classModel.shiftId
    ) {
      let date;
      if (openingDate) {
        date = formatDate(openingDate, 'yyyy-MM-dd', 'en-US');
      } else {
        date = formatDate(this.classModel?.openingDate, 'yyyy-MM-dd', 'en-US');
      }
      this.api
        .searchAvailTeacherForClass(
          this.branchId,
          this.classModel.shiftId,
          date,
          this.classModel?.subjectId
        )
        .subscribe(
          (data: TeacherSearchArray) => {
            this.teacherArray = data.teacherList;
            if (this.teacherArray)
              this.form.controls.teacherName.setValue(
                this.teacherArray[0].teacherId
              );
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

  getRoomList(openingDate?: string): void {
    if (
      this.classModel &&
      this.classModel.openingDate &&
      this.branchId &&
      this.classModel.shiftId
    ) {
      let date;
      if (openingDate) {
        date = formatDate(openingDate, 'yyyy-MM-dd', 'en-US');
      } else {
        date = formatDate(this.classModel?.openingDate, 'yyyy-MM-dd', 'en-US');
      }
      this.api
        .getRoomByBranchShiftOpeningDate(
          this.branchId,
          this.classModel?.shiftId,
          date
        )
        .subscribe((response) => {
          this.roomArray = response.roomList;
          if (this.roomArray)
            this.form.controls.roomNo.setValue(this.roomArray[0].roomId);
        });
    }
  }

  getRoomListChange() {
    this.getRoomList(this.form.controls.openingDate.value);
    this.getTeacherList(this.form.controls.openingDate.value);
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
    domain: ['#aaece5', '#ffe6b1', '#b3d7f3', '#e3c5d5', '#c3cdd7'],
  };

  optimizeClass() {
    var chartArrayAfter: Array<Single_Chart> = [];
    if (this.classModel?.numberOfStudent) {
      var numOfStudent: number = this.classModel?.numberOfStudent;
      if (numOfStudent > this.MAX_CLASS_NUM) {
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
        (numOfStudent >= this.MIN_CLASS_NUM &&
          numOfStudent <= this.MAX_CLASS_NUM) ||
        numOfStudent < this.MIN_CLASS_NUM
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
    this.optimizeClass();
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
      if (x.label == this.clickedItemChart?.name && x.isActivated == 1) {
        this.isDisplayActivateButton = false;
        this.initForm(
          x.classId,
          x.classCreateRequest?.className,
          x.classActivateRequest?.teacherId,
          x.classActivateRequest?.roomId,
          x.classCreateRequest?.openingDate
        );
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
        let array = new Array<Booking>();
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

  //activate class
  activateClass() {
    let form1: FormGroup = this.form;
    let studentPerClassArray: Array<Booking> | undefined =
      this.studentPerClassArray;
    let studentPerClassObject: BookingPerClass | undefined =
      this.studentPerClassObject;
    let index: number = 0;
    // add classActivatedRequest for studentPerClassObject
    let bookingNumberArray: Array<number> = [];
    studentPerClassArray?.forEach((x) => {
      if (x.bookingId) bookingNumberArray.push(x.bookingId);
    });
    let user: LoginResponse = this.localStorage.get('user');
    const request: ClassActivationRequest = {
      className: form1.controls.name.value,
      shiftId: this.classModel?.shiftId,
      subjectId: this.classModel?.subjectId,
      branchId: this.branchId,
      openingDate: form1.controls.openingDate.value,
      creator: user.username,
      roomId: +form1.controls.roomNo.value,
      teacherId: +form1.controls.teacherName.value,
      bookingIdList: bookingNumberArray,
    };
    studentPerClassObject?.setClassActivateRequest(request);
    // thêm lớp hiện tại vào mảng activate
    if (studentPerClassObject) {
      this.activateClassArray.forEach((x, i) => {
        if (x.label == studentPerClassObject?.label) {
          this.activateClassArray.splice(i, 1);
        }
      });
      this.activateClassArray.push(studentPerClassObject);
      index = this.activateClassArray.length - 1;
    }
    this.activateClassArray[index].setIsActivated(0);
    this.api.activateClass(request).subscribe(
      (response: number) => {
        if (this.activateClassArray[index]) {
          this.activateClassArray[index].setIsActivated(1);
        }
        let request: NotiClassRequest = {
          classId: response,
          senderUsername: 'system',
          title:
            'Thông báo khai giảng lớp học ' +
            studentPerClassObject?.classActivateRequest?.className,
          body:
            'Trung tâm CNPR thông báo lớp học ' +
            studentPerClassObject?.classActivateRequest?.className +
            ' bạn đăng ký sẽ khai giảng vào ngày ' +
            form1.controls.openingDate.value +
            '.Để biết thêm thông tin chi tiết, vui lòng truy cập mục Lớp Học/Lịch Học.Chân Thành Cám Ơn !',
        };
        this.api.createNotiForClass(request).subscribe((response) => {
          console.log('Kết quả gửi thông báo session: ' + response);
        });
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        if (error.error == 'Opening Day must be a day in Shift!') {
          this.callAlert(
            'Ok',
            'Ngày khai giảng bạn chọn không khớp với ca học'
          );
        } else if (error.error == 'Null or invalid opening day!') {
          this.callAlert('Ok', 'Ngày khai giảng không hợp lệ');
        } else {
          this.callAlert(
            'Ok',
            'Có lỗi xảy ra khi khai giảng lớp vui lòng thử lại'
          );
        }
        this.activateClassArray[index].setIsActivated(2);
      }
    );
  }

  //ask when number of student invalid
  preActivateClass() {
    if (
      this.studentPerClassArray &&
      this.studentPerClassArray.length < this.MIN_CLASS_NUM
    ) {
      this.callAlert(
        'YN',
        'Số lượng học sinh tối thiểu một lớp quy định của trung tâm là ' +
          this.MIN_CLASS_NUM +
          ' .Bạn đang mở lớp chỉ với ' +
          this.studentPerClassArray.length +
          ' học viên.Bạn có chắc chắn muốn tiếp tục ?'
      );
    } else if (
      this.studentPerClassArray &&
      this.studentPerClassArray.length > this.MAX_CLASS_NUM
    ) {
      this.callAlert(
        'YN',
        'Số lượng học sinh tối đa một lớp quy định của trung tâm là ' +
          this.MAX_CLASS_NUM +
          ' .Bạn đang mở lớp lên tới ' +
          this.studentPerClassArray.length +
          ' học viên.Bạn có chắc chắn muốn tiếp tục ?'
      );
    } else if (
      this.studentPerClassArray &&
      this.studentPerClassArray.length >= this.MIN_CLASS_NUM &&
      this.studentPerClassArray.length <= this.MAX_CLASS_NUM
    ) {
      this.activateClass();
    }
  }

  // change student list per class
  changeClickedObject?: BookingPerClass; //object of current click in change frame
  allIsChosenObjectArray?: Array<BookingPerClass>; // array of all array of booking ( after process ) in change frame
  isChosenObject?: BookingPerClass; //object chosen to change with current click object

  isOpeningChangeStudentFrame = false;
  colorIndex: number = 5;
  colorArray: Array<string> = [
    'rgb(170, 236, 229,0.7)',
    'rgb(255,230,177,0.7)',
    'rgb(179, 215, 243,0.7)',
    'rgb(227,197,213,0.7)',
    'rgb(195,205,215,0.7)',
  ];

  openChangeStudentFrame(): void {
    this.allIsChosenObjectArray = [];
    this.isChosenObject = undefined;
    this.changeClickedObject = undefined;
    if (
      this.studentPerClassObject &&
      this.studentPerClassObject.isActivated != 1
    ) {
      this.changeClickedObject = this.studentPerClassObject;
    }
    if (this.allStudentPerClassObjectArray) {
      for (let i = 0; i < this.allStudentPerClassObjectArray.length; i++) {
        if (
          this.allStudentPerClassObjectArray[i].label !=
            this.studentPerClassObject?.label &&
          this.allStudentPerClassObjectArray[i].isActivated != 1
        ) {
          this.allIsChosenObjectArray.push(
            this.allStudentPerClassObjectArray[i]
          );
        }
      }
    }
    this.isChosenObject = this.allIsChosenObjectArray[0];
    this.isOpeningChangeStudentFrame = true;
  }

  changeMenuIsOpenClass(newIsOpenClass: BookingPerClass) {
    this.isChosenObject = newIsOpenClass;
  }

  closeChangeStudentFrame(): void {
    this.changeClickedObject?.setNumberOfStudent(
      this.changeClickedObject.studentPerClassArray.length
    );
    this.allIsChosenObjectArray?.forEach((x) =>
      x.setNumberOfStudent(x.studentPerClassArray.length)
    );
    this.isOpeningChangeStudentFrame = false;
    this.chartArray = [];
    this.allStudentPerClassObjectArray?.forEach((x) => {
      let item: Single_Chart = {
        name: x.label,
        value: x.numberOfStudent,
      };
      this.chartArray.push(item);
    });
    if (this.studentPerClassArray) {
      if (
        this.studentPerClassArray?.length <= 4 ||
        this.studentPerClassArray.length >= 16
      ) {
        this.isDisplayActivateButton = false;
      } else if (
        this.studentPerClassArray?.length >= 5 ||
        this.studentPerClassArray.length <= 15
      ) {
        this.isDisplayActivateButton = true;
      }
    }
  }

  getBackgroundColor(): string | undefined {
    return this.studentPerClassObject?.color;
  }

  drop(event: CdkDragDrop<Booking[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if (this.changeClickedObject?.studentPerClassArray)
        moveItemInArray(
          this.changeClickedObject.studentPerClassArray,
          event.previousIndex,
          event.currentIndex
        );
    }
  }

  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  doYes(): void {
    this.haveAlertYN = false;
    this.activateClass();
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
