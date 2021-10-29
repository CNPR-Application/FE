export interface SessionList {
  pageNo: number;
  pageSize: number;
  pageTotal: number;
  sessionList?: SessionResponse[];
}

export interface SessionResponse {
  sessionId: number;
  teacherId?: number;
  teacherName?: string;
  teacherImage?: string;
  roomId?: number;
  roomName?: string;
  startTime: string;
  endTime: string;
}

export interface SessionRequest {
  sessionId?: number;
  classId?: number;
  newRoomId: number | null;
  changeAllRoom?: boolean;
  newTeacherId: number | null;
  changeAllTeacher?: boolean;
  newStartTime: string | null;
  changeAllTime?: boolean;
}
