export interface CurriculumResponse {
  pageNo: number;
  pageSize: number;
  pageTotal: number;
  curriculumResponseDtos ?: CurriculumResponseArray[];
}

export interface CurriculumResponseArray {
    curriculumId?: number;
    curriculumCode?: string;
    curriculumName?: string;
    description?: string;
    creatingDate?: Date;
    isAvailable?: boolean;
    image?: string;
    linkClip?: string;
    learningOutcome?: string;
}
