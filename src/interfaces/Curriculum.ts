export interface CurriculumResponse {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  curriculumResponseDtos ?: CurriculumResponseArray[];
}

export interface CurriculumResponseArray {
    curriculumId?: number;
    curriculumCode?: string;
    curriculumName?: string;
    description?: string;
    creatingDate?: Date;
    isAvailable?: boolean;
    learningOutcome?: string;
}
