export interface ShiftArray {
  pageNo: number;
  pageSize: number;
  pageTotal: number;
  shiftDtos?: Shift[];
}

export interface Shift {
  shiftId?: number;
  dayOfWeek?: string;
  timeStart?: string;
  timeEnd?: string;
  duration?: number;
  available?: boolean;
}

export const DAY_OF_WEEKS: shiftModel[] = [
  { id: 1, value: '2' },
  { id: 2, value: '3' },
  { id: 3, value: '4' },
  { id: 4, value: '5' },
  { id: 5, value: '6' },
  { id: 6, value: '7' },
  { id: 7, value: 'CN' },
];

export const TIME_START: shiftModel[] = [
  { id: 1, value: '08:00' },
  { id: 2, value: '09:30' },
  { id: 3, value: '14:00' },
  { id: 4, value: '15:30' },
  { id: 5, value: '18:00' },
  { id: 6, value: '19:30' },
];

export const TIME_END: shiftModel[] = [
  { id: 1, value: '09:30' },
  { id: 2, value: '11:00' },
  { id: 3, value: '15:30' },
  { id: 4, value: '17:00' },
  { id: 5, value: '19:30' },
  { id: 6, value: '21:00' },
];

export const CITY: string[] = [
  'Hòa Bình',
  'Sơn La',
  'Điện Biên',
  'Lai Châu',
  'Lào Cai',
  'Yên Bái',
  'Thanh Hóa',
  'Nghệ An',
  'Hà Tĩnh',
  'Quảng Bình',
  'Quảng Trị',
  'Thừa Thiên Huế',
  'TP Hồ Chí Minh',
  'Bà Rịa Vũng Tàu',
  'Bình Dương',
  'Bình Phước',
  'Đồng Nai',
  'Tây Ninh',
  'Phú Thọ',
  'Hà Giang',
  'Tuyên Quang',
  'Cao Bằng',
  'Bắc Kạn',
  'Thái Nguyên',
  'Lạng Sơn',
  'Bắc Giang',
  'Quảng Ninh',
  'Đà Nẵng',
  'Quảng Nam',
  'Quảng Ngãi',
  'Bình Định',
  'Phú Yên',
  'Khánh Hòa',
  'Ninh Thuận',
  'Bình Thuận',
  'An Giang',
  'Bạc Liêu',
  'Bến Tre',
  'Cà Mau',
  'Cần Thơ',
  'Đồng Tháp',
  'Hậu Giang',
  'Kiên Giang',
  'Long An',
  'Sóc Trăng',
  'Tiền Giang',
  'Trà Vinh',
  'Vĩnh Long',
  'Hà Nội',
  'Bắc Ninh',
  'Hà Nam',
  'Hải Dương',
  'Hải Phòng',
  'Hưng Yên',
  'Nam Định',
  'Thái Bình',
  'Vĩnh Phúc',
  'Ninh Bình',
  'Kon Tum',
  'Gia Lai',
  'Đắk Lắk',
  'Đắk Nông',
  'Lâm Đồng',
];

export interface shiftModel {
  id: number;
  value: string;
  trans?: string;
}
