import { CurriculumResponseArray } from './Curriculum';

export interface SubjectArray {
  pageNo: number;
  pageSize: number;
  totalPage?: number;
  subjectsResponseDto?: Array<Subject>;
}

export interface SubjectTeacherArray {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  subjectList?: Array<Subject>;
}

export interface Subject {
  subjectId?: number;
  subjectCode: string;
  subjectName: string;
  price: number;
  creatingDate?: string;
  description?: string;
  isAvailable?: boolean;
  slot?: number;
  slotPerWeek?: number;
  rating: number;
  curriculumId?: number;
  curriculumName?: string;
  curriculumCode?: string;
  curriculum?: CurriculumResponseArray;
}

export interface SubjectDetailArray {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  subjectDetailDtoList?: SubjectDetail[];
}

export interface SubjectDetail {
  subjectDetailId?: number;
  subjectId?: number;
  weekNum: number;
  weekDescription?: string;
  isAvailable?: boolean;
  learningOutcome?: string;
}
