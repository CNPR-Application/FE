export interface SubjectInTeacher {
  subjectId: number;
  subjectName: string;
}

export interface TeacherInfo {
  teacherId: number;
  name: string;
  username: string;
  address?: string;
  email?: string;
  birthday: string;
  phone: string;
  image?: string;
  role: string;
  creatingDate: string;
  startingDate: string;
  experience?: string;
  rating: number;
  teachingSubjectList?: Array<SubjectInTeacher>;
}

export interface TeacherArray {
  teacherList?: Array<TeacherInfo>;
  pageNo: number;
  pageSize: number;
  totalPage: number;
}
