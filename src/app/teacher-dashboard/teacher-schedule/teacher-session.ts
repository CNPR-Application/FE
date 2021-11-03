import { ScheduleResponse } from 'src/interfaces/Schedule';

export class TeacherScheduleClass {
  timeStart: string;
  timeEnd: string;
  monSession?: ScheduleResponse;
  tueSession?: ScheduleResponse;
  wedSession?: ScheduleResponse;
  thuSession?: ScheduleResponse;
  friSession?: ScheduleResponse;
  satSession?: ScheduleResponse;
  sunSession?: ScheduleResponse;

  constructor(
    timeStart: string,
    timeEnd: string,
    session: ScheduleResponse,
    date: string
  ) {
    this.timeEnd = timeEnd;
    this.timeStart = timeStart;
    this.addToList(session, date);
  }

  addToList(session: ScheduleResponse, date: string) {
    if (date == 'mon') {
      this.monSession = session;
    } else if (date == 'tue') {
      this.tueSession = session;
    } else if (date == 'wed') {
      this.wedSession = session;
    } else if (date == 'thu') {
      this.thuSession = session;
    } else if (date == 'fri') {
      this.friSession = session;
    } else if (date == 'sat') {
      this.satSession = session;
    } else if (date == 'sun') {
      this.sunSession = session;
    }
  }
}
