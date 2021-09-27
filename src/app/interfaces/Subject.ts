import { CurriculumResponseArray } from './Curriculum';

export interface SubjectArray {
  pageNo: number;
  pageSize: number;
  pageTotal: number;
  subjectsResponseDtos?: Subject[];
}

export interface Subject {
  subjectId?: number;
  subjectCode: string;
  subjectName: string;
  price: number;
  creatingDate?: string;
  description?: string;
  isAvailable?: boolean;
  image?: string;
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
  pageTotal: number;
  subjectDetailDtoList?: SubjectDetail[];
}

export interface SubjectDetail {
  subjectDetailId?: number;
  subjectId?: number;
  weekNum?: number;
  weekDescription?: string;
  isAvailable?: boolean;
  learningOutcome?: string;
}
