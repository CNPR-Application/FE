export interface AttendanceList {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  attendanceList: AttendanceResponse[];
}

export interface AttendanceResponse {
  attendanceId: number;
  sessionId?: number;
  studentInClassId?: number;
  studentClassId?: number;
  studentId?: number;
  studentUsername?: string;
  studentName?: string;
  studentImage?: string;
  checkingDate?: string;
  isReopen?: boolean;
  closingDate?: string;
  reopenReason?: string;
  status: string;
}

export interface AttendanceEditRequest {
  attendanceId: number;
  status: string;
}

export interface AttendanceReopenRequest {
  sessionId: number;
  reopenReason: string;
}
