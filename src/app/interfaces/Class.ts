export interface ClassArray {
  pageNo?: number;
  pageSize?: number;
  pageTotal?: number;
  classList?: ClassResponse[];
}

export interface ClassResponse {
  classId?: number;
  className?: string;
  openingDate?: string;
  slot?: number;
  status?: string;
  subjectId?: number;
  subjectName?: string;
  subjectPrice?: number;
  branchId?: number;
  branchName?: string;
  shiftId?: number;
  shiftDescription?: string;
  teacherId?: string;
  teacherName?: string;
  roomId?: number;
  roomNo?: number;
  numberOfStudent?: number;
  managerId?: number;
  managerUsername?: string;
}

export interface ClassRequest {
  className?: string;
  openingDate?: string;
  subjectId?: number;
  branchId?: number;
  shiftId?: number;
  creator?: string;
  roomId?: number;
  roomNo?: number;
}

export interface ClassStatus {
  waitingClass: number;
  studyingClass: number;
  finishedClass: number;
  canceledClass: number;
}

export interface ClassActivationRequest {
  roomNo?: number;
  teacherId?: number;
  classId?: number;
  creator?: string;
  bookingIdList?: number[];
}

export interface StudentInClassArray {
  pageNo: number;
  pageSize: number;
  studentInClassSearchResponseDtos: StudentInClass[];
}

export interface StudentInClass {
  classId: number;
  studentId: number;
  studentUserName: string;
  studentName: string;
  image: string;
  bookingId: number;
  payingDate: string;
}
