export interface SubjectInTeacher {
  subjectId?: number;
  subjectCode?: string;
  subjectName?: string;
}

export interface TeachingSubjectRequest {
  teacherUsername?: string;
  subjectId?: number;
}

export interface TeacherInfo {
  teacherId: number;
  teacherName: string;
  teacherUsername: string;
  teacherAddress?: string;
  teacherEmail?: string;
  teacherBirthday: string;
  teacherPhone: string;
  teacherImage?: string;
  role: string;
  accountCreatingDate: string;
  teacherStartingDate: string;
  teacherExperience?: string;
  teacherRating: number;
  teachingSubjectList?: Array<SubjectInTeacher>;
}

export interface TeacherArray {
  teacherInBranchList?: Array<TeacherInfo>;
  pageNo: number;
  pageSize: number;
  totalPage: number;
}
export interface TeacherSearchArray {
  teacherList?: Array<TeacherInfo>;
  pageNo: number;
  pageSize: number;
  totalPage: number;
}
