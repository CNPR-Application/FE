export interface ManagerStatistic {
  newClass?: number;
  newBooking?: number;
  newRegisteredInfo?: number;
  newStudent?: number;
  monthRevenue: number;
  totalClass?: number;
  totalBooking?: number;
  totalRegisteredInfo?: number;
  totalStudent?: number;
}

export interface AdminStatisticArray {
  branchesStatisticResponseDtoList?: Array<AdminStatistic>;
  totalNewClass?: number;
  totalNewBooking?: number;
  totalNewRegisteredInfo?: number;
  totalNewStudent?: number;
  totalNewTeacher?: number;
  totalMonthRevenue: number;
}

export interface AdminStatistic {
  branchId?: number;
  branchName?: string;
  newClass?: number;
  newBooking?: number;
  newRegisteredInfo?: number;
  newStudent?: number;
  newTeacher?: number;
  monthRevenue: number;
}
