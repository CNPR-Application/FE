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
  roomNo?: number;
  numberOfStudent?: number;
}

export interface ClassRequest {
  className?: string;
  openingDate?: string;
  subjectId?: number;
  branchId?: number;
  shiftId?: number;
}

export interface ClassStatus {
  waitingClass: number;
  studyingClass: number;
  finishedClass: number;
  canceledClass: number;
}

export interface ClassActivationRequest {
  roomId?: number;
  teacherId?: number;
  classId?: number;
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
