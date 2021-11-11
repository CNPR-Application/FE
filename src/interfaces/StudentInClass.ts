export interface StudentInClassListResponse {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  studentInClassSearchResponseDtos?: StudentInClassResponse[];
}

export interface StudentInClassResponse {
  classId: number;
  studentId: number;
  studentUserName: string;
  studentName: string;
  image?: string;
  bookingId?: number;
  payingDate?: string;
}

export interface StudentInClassArray {
  pageNo: number;
  pageSize: number;
  studentInClassSearchResponseDtos: StudentInClass[];
}

export interface StudentInClass {
  classId: number;
  studentId: number;
  studentUserName: string;
  studentName: string;
  image: string;
  bookingId: number;
  payingDate: string;
}
