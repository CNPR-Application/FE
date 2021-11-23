export interface ManagerStatistic {
  newClass?: number;
  newBooking?: number;
  newRegisteredInfo?: number;
  newStudent?: number;
  newTeacher?: number;
}

export interface AdminStatisticArray {
  branchesStatisticResponseDtoList?: Array<AdminStatistic>;
  totalNewClass?: number;
  totalNewBooking?: number;
  totalNewRegisteredInfo?: number;
  totalNewStudent?: number;
  totalNewTeacher?: number;
}

export interface AdminStatistic {
  branchId?: number;
  branchName?: string;
  newClass?: number;
  newBooking?: number;
  newRegisteredInfo?: number;
  newStudent?: number;
  newTeacher?: number;
}
