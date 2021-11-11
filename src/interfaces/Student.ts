export interface StudentArrayResponse {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  studentResponseDtos: StudentResponse[];
}

export interface StudentArraySearchResponse {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  studentList: StudentResponse[];
}

export interface StudentResponse {
  studentId: number;
  username?: string;
  name: string;
  address: string;
  email?: string;
  birthday?: string;
  phone: string;
  image?: string;
  role?: string;
  parentPhone?: string;
  parentName?: string;
}
