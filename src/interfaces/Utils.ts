export interface Single_Chart {
  label?: string;
  name?: string;
  value?: number;
}

export class SingleChartClass{
  name: string;
  value: number;

  constructor(name: string, value: number){
    this.name = name;
    this.value = value;
  }
}

