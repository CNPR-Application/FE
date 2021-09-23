import {
  AttendanceEditRequest,
  AttendanceResponse,
} from 'src/app/interfaces/Attendance';
import { SessionResponse } from 'src/app/interfaces/Session';

export class AttendanceEditClass implements AttendanceEditRequest {
  attendanceId: number;
  status: string;

  constructor(attendanceId: number, status: string) {
    this.attendanceId = attendanceId;
    this.status = this.setStatus(status);
  }

  setStatus(status: string) {
    if (status === 'not yet') {
      return 'absent';
    } else {
      return status;
    }
  }
}

export class AttendanceChecking {
  attendanceResponse: AttendanceResponse;
  isPresent: boolean;
  isAbsent: boolean;

  constructor(attendance: AttendanceResponse) {
    this.attendanceResponse = attendance;
    this.isPresent = this.setStatusPresent(this.attendanceResponse.status);
    this.isAbsent = !this.isPresent;
  }

  setStatusPresent(status: string) {
    if (status === 'present') {
      return true;
    }
    return false;
  }
}

export class SessionStatus {
  sessionResponse: SessionResponse;
  status: string;

  constructor(sessionResponse: SessionResponse) {
    this.sessionResponse = sessionResponse;
    this.status = this.setStatus();
  }

  setStatus(): string {
    let now = new Date();
    now = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    let startTime = new Date(this.sessionResponse.startTime);
    let endTime = new Date(this.sessionResponse.endTime);
    if (
      startTime.getTime() <= now.getTime() &&
      endTime.getTime() >= now.getTime()
    ) {
      return 'Đang mở';
    } else if (now.getTime() < startTime.getTime()) {
      return 'Trong tương lai';
    } else if (now.getTime() > endTime.getTime()) {
      return 'Đã đóng';
    }
    return '';
  }
}
