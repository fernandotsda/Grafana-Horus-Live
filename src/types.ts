import { DataQuery, DataSourceJsonData, FieldType } from '@grafana/data';

export interface JsonField {
  name?: string;
  jsonPath: string;
  type?: FieldType;
}

export type Pair<T, K> = [T, K];

export interface HorusQuery extends DataQuery {
  fields: JsonField[];
  interval: number;
  method: string;
  urlPath: string;
  queryParams: string;
  params: Array<Pair<string, string>>;
  headers: Array<Pair<string, string>>;
  body: string;
  keepdata: boolean;
  strict: boolean;
  capacity: number;
}

export const defaultQuery: Partial<HorusQuery> = {
  fields: [{ jsonPath: '', type: FieldType.string }],
  method: 'GET',
  queryParams: '',
  interval: 1000,
  capacity: 1000,
  urlPath: '',
  keepdata: true,
  strict: true,
};

export interface HorusDataSourceOptions extends DataSourceJsonData {
  queryParams?: string;
}
