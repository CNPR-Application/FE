export interface LoginRequest {
  username: string;
  password: string;
}

export interface InfoArray {
  pageNo?: number;
  pageSize?: number;
  totalPage?: number;
  accountResponseDtoList?: LoginResponse[];
}

export interface LoginResponse {
  username?: string;
  name?: string;
  address?: string;
  email?: string;
  birthday?: string;
  phone?: string;
  image?: string;
  role?: string;
  creatingDate?: string;
  branchId?: number;
  branchName?: string;
  parentPhone?: string;
  parentName?: string;
  experience?: string;
  rating?: string;
  isAvailable?: boolean;
  branchResponseDtoList?: Branch[];
}

export interface Branch {
  branchId: number;
  branchName: string;
}

export interface ImageRequest {
  image?: string;
  keyword?: string;
}

export interface ImageResponse {
  url?: string;
  result: boolean;
}

export interface Guest {
  id?: number;
  customerName?: string;
  phone?: string;
  city?: string;
  bookingDate?: string;
  description?: string;
  curriculumId?: number;
  curriculumName?: string;
  branchId?: number;
  status?: string;
}

export interface GuestArray {
  pageNo?: number;
  pageSize?: number;
  totalPage?: number;
  registeringGuestSearchResponseDtos?: Guest[];
}

export interface CreateInFoResponse {
  username: string;
}
