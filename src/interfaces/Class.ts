export interface ClassArray {
  pageNo: number;
  pageSize?: number;
  totalPage?: number;
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
  teacherUsername?: string;
  roomId?: number;
  roomName?: string;
  numberOfStudent?: number;
  managerId?: number;
  managerUsername?: string;
  suspend?: boolean;
  studentInClassId?: number;
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

export interface ClassEditRequest {
  className?: string;
  openingDate?: string;
  roomId?: number;
  status?: string;
}

export interface ClassStatus {
  waitingClass: number;
  studyingClass: number;
  finishedClass: number;
  canceledClass: number;
}

export interface ClassActivationRequest {
  roomId?: number;
  className?: string;
  openingDate?: string;
  subjectId?: number;
  branchId?: number;
  shiftId?: number;
  teacherId?: number;
  creator?: string;
  bookingIdList?: number[];
}

export interface ClassDeleteRequest {
  classId: number;
  reason: string;
}

export interface ClassSuspendRequest {
  openingDate: string;
  type: string;
  newClassId: number;
  studentUsername: string;
  branchId?: number;
  description?: string;
  subjectId?: number;
}
