export interface Single_Chart {
  label?: string;
  name?: string;
  value?: number;
}

export class SingleChartClass {
  name: string;
  value: number;

  constructor(name: string, value: number) {
    this.name = name;
    this.value = value;
  }
}

export interface NotificationModel {
  data: DataNotiInside;
  fcmMessageId: string;
  from: string;
  notification: NotiInside;
  priority: string;
}

export interface NotiInside {
  title: string;
  body: string;
}
export interface DataNotiInside {
  body: string;
  content: string;
}
