import {
  AttendanceEditRequest,
  AttendanceResponse,
} from 'src/interfaces/Attendance';
import { SessionResponse } from 'src/interfaces/Session';

export class AttendanceManagerClass implements AttendanceEditRequest {
  attendanceId: number;
  status: string;

  constructor(attendanceId: number, status: string) {
    this.attendanceId = attendanceId;
    this.status = status;
  }
}

export class AttendanceCheckingManager {
  attendanceResponse: AttendanceResponse;
  isPresent: boolean;
  isAbsent: boolean;
  isNotYet: boolean;

  constructor(attendance: AttendanceResponse) {
    this.attendanceResponse = attendance;
    this.isPresent = this.setStatusPresent(this.attendanceResponse.status);
    this.isAbsent = this.setStatusAbsent(this.attendanceResponse.status);
    this.isNotYet = this.setStatusNotYet(this.attendanceResponse.status);
  }

  setStatusPresent(status: string) {
    if (status === 'present') {
      return true;
    }
    return false;
  }

  setStatusAbsent(status: string) {
    if (status === 'absent') {
      return true;
    }
    return false;
  }

  setStatusNotYet(status: string) {
    if (status === 'not yet') {
      return true;
    }
    return false;
  }
}
