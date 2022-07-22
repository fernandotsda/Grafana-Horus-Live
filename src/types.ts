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
  dataGroupId: string;
  strict: boolean;
  capacity: number;
}

export const defaultQuery: Partial<HorusQuery> = {
  fields: [{ jsonPath: '', type: FieldType.string }],
  method: 'POST',
  queryParams: '',
  interval: 2000,
  capacity: 50,
  urlPath: '',
  keepdata: false,
  strict: true,
  dataGroupId: '',
};

export interface HorusDataSourceOptions extends DataSourceJsonData {
  queryParams?: string;
}
