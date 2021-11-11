export interface BookingArray {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  classList?: Booking[];
}

export interface Booking {
  bookingId?: number;
  payingDate?: string;
  subjectId?: number;
  subjectName?: string;
  shiftId?: number;
  shiftDescription?: string;
  studentId?: string;
  studentUsername?: string;
  studentName?: string;
  image?: string;
  status?: string;
  branchId?: number;
  branchName?: string;
  payingPrice?: number;
  description?: string;
  classId?: number;
  className?: string
}
