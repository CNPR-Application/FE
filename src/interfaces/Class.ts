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
  roomName?: string;
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
  roomName?: string;
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
  creator?: string;
  bookingIdList?: number[];
}
