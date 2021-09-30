import { ScheduleResponse } from 'src/interfaces/Schedule';

export class ScheduleClass {
  timeStart: string;
  timeEnd: string;
  sessionList?: Array<ScheduleResponse>;
  moreColumnArray?: Array<number>;

  constructor(timeStart: string, timeEnd: string, session: ScheduleResponse) {
    this.timeEnd = timeEnd;
    this.timeStart = timeStart;
    this.addToList(session);
  }

  addToList(session: ScheduleResponse) {
    if (!this.sessionList) {
      this.sessionList = new Array<ScheduleResponse>();
    }
    this.sessionList.push(session);
    var needingCol = 0;
    this.moreColumnArray = [];
    if (this.sessionList.length <= 3) {
      needingCol = 4 - this.sessionList.length;
    }
    while (needingCol >= 1) {
      this.moreColumnArray?.push(1);
      needingCol--;
    }
  }
}
