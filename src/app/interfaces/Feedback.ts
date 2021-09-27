export interface FeedbackListResponse {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  feedbackList?: FeedbackResponse[];
}

export interface FeedbackResponse {
  studentInClassId: string;
  studentId: number;
  studentUsername: string;
  studentName: string;
  studentImage?: string;
  teacherRating?: number;
  subjectRating?: number;
  feedback?: string;
}
