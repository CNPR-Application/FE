import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  constructor() {}

  convertTimeFromApi(time: string): number {
    let changeTimeDate;
    changeTimeDate = new Date(time);
    changeTimeDate = changeTimeDate?.getTime() - 7 * 60 * 60 * 1000;
    return changeTimeDate;
  }

  checkInThePast(startTimeApi: string, endTimeApi: string): string {
    let now = new Date();
    let startTime = new Date(startTimeApi);
    startTime = new Date(startTime.getTime() - 7 * 60 * 60 * 1000);
    let endTime = new Date(endTimeApi);
    endTime = new Date(endTime.getTime() - 7 * 60 * 60 * 1000);
    if (
      startTime.getTime() <= now.getTime() &&
      endTime.getTime() >= now.getTime()
    ) {
      return 'Đang mở';
    } else if (now.getTime() < startTime.getTime()) {
      return 'Trong tương lai';
    } else if (now.getTime() > endTime.getTime()) {
      return 'Đã đóng';
    }
    return 'Đã đóng';
  }
}
