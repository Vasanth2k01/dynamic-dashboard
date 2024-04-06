export interface ObjectKeyAny {
  [key: string]: any;
}

export interface CSVChartType {
  header: string[];
  value: [][];
}

export interface IOlympicData {
  id?: number;
  athlete: string;
  age: number;
  country: string;
  year: number;
  date: string;
  sport: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export interface GroupColumnType {
  name: string;
  columns: string[];
}

export interface ProgressBarProps {
  progressPercentage: number;
}
