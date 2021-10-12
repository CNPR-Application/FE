import { Booking } from 'src/interfaces/Booking';
import { ClassActivationRequest, ClassRequest } from 'src/interfaces/Class';

export interface Booking_Per_Class {
  label: string;
  numberOfStudent: number;
  studentPerClassArray: Array<Booking>;
  isCreateClass: boolean;
  isMovedStudent: boolean;
  isActivated: number;
  color: string;
}

export class BookingPerClass implements Booking_Per_Class {
  label: string;
  numberOfStudent: number;
  studentPerClassArray: Array<Booking>;
  isCreateClass: boolean;
  isMovedStudent: boolean;
  isActivated: number;
  color: string;
  gridRow: string;
  classCreateRequest?: ClassRequest;
  classActivateRequest?: ClassActivationRequest;
  classId?: number;

  constructor(
    label: string,
    numberOfStudent: number,
    studentPerClassArray: Array<Booking>,
    isCreateClass: boolean,
    isMovedStudent: boolean,
    isActivated: number,
    color: string
  ) {
    this.label = label;
    this.numberOfStudent = numberOfStudent;
    this.studentPerClassArray = studentPerClassArray;
    this.isCreateClass = isCreateClass;
    this.isMovedStudent = isMovedStudent;
    this.isActivated = isActivated;
    this.color = color;
    this.gridRow = this.getGridRow(this.numberOfStudent);
  }

  setClassActivateRequest(request: ClassRequest, classActivateRequest: ClassActivationRequest) {
    this.classCreateRequest = request;
    this.classActivateRequest = classActivateRequest;
  }

  setClassId(id: number | undefined) {
    this.classId = id;
  }

  getGridRow(numOfStudent: number | undefined): string {
    let numOfLine: number = 0;
    let line: string = '7em ';
    if (numOfStudent) {
      numOfStudent = +numOfStudent;
      numOfLine = Math.round(+numOfStudent / 2);
    }
    while (numOfLine > 1) {
      line += ' 7em';
      numOfLine--;
    }
    return line;
  }

  getLabel() {
    return this.label;
  }

  setLabel(label: string) {
    this.label = label;
  }

  getColor() {
    return this.color;
  }

  setColor(color: string) {
    this.color = color;
  }

  getNumberOfStudent() {
    return this.numberOfStudent;
  }

  setNumberOfStudent(numberOfStudent: number) {
    this.numberOfStudent = numberOfStudent;
    this.gridRow = this.getGridRow(numberOfStudent);
  }

  getIsCreateClass() {
    return this.isCreateClass;
  }

  setIsCreateClass(isCreateClass: boolean) {
    this.isCreateClass = isCreateClass;
  }
  getIsMovedStudent() {
    return this.isMovedStudent;
  }

  setIsMovedStudent(isMovedStudent: boolean) {
    this.isMovedStudent = isMovedStudent;
  }
  getIsActivated() {
    return this.isActivated;
  }

  setIsActivated(isActivated: number) {
    this.isActivated = isActivated;
  }

  getStudentPerClassArray() {
    return this.studentPerClassArray;
  }

  setStudentPerClassArray(studentPerClassArray: Array<Booking>) {
    this.studentPerClassArray = studentPerClassArray;
  }
}

export class ActivatingClass {
  classCreateRequest?: ClassRequest;
}
