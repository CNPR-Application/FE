export interface ScheduleListResponse {
  sessionList?: ScheduleResponse[];
}

export interface ScheduleResponse {
  sessionId: number;
  classId: number;
  className: string;
  subjectId: number;
  subjectName: string;
  teacherId?: number;
  teacherName?: string;
  teacherImage?: string;
  roomId?: number;
  roomName?: string;
  startTime: string;
  endTime: string;
}

export interface ScheduleTeacherListResponse {
  MONDAY: ScheduleTeacherMiddle;
  TUESDAY: ScheduleTeacherMiddle;
  WEDNESDAY: ScheduleTeacherMiddle;
  THURSDAY: ScheduleTeacherMiddle;
  FRIDAY: ScheduleTeacherMiddle;
  SATURDAY: ScheduleTeacherMiddle;
  SUNDAY: ScheduleTeacherMiddle;
}

export interface ScheduleTeacherMiddle {
  datetime: string;
  sessionList?: ScheduleResponse[];
}
