export type ChartType = 'table' | 'pie' | 'bar' | 'line';
export type ChartData = {
  id: string;
  type: ChartType;
  title: string;
  data: any;
  gridsterItem: import('angular-gridster2').GridsterItem;
  position?: ChartPosition;
};

export type ChartPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};
