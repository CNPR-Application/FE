export interface SessionList {
  pageNo: number;
  pageSize: number;
  pageTotal: number;
  sessionClassList?: SessionResponse[];
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
