import { CircularDataFrame, FieldType } from '@grafana/data';
import { JSONPath } from 'jsonpath-plus';
import { parseValues } from './parseValues';
import { HorusQuery, JsonField } from './types';
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export function HandleDataForField(data: any, field: JsonField): any {
  let result: any;
  try {
    result = parseValues(
      JSONPath({
        path: field.jsonPath,
        json: data ?? '',
      }),
      field.type ?? FieldType.string
    )[0];
  } catch {
    throw new Error('Unsupported field type');
  }
  return result;
}

export function AddFrameField(frameFields: any, data: any, field: JsonField): Object {
  return {
    ...frameFields,
    // Add new field value
    [field.name ?? '']: data,
  };
}

export function AddDataToQueryFrame(frame: CircularDataFrame<any>, query: HorusQuery, rawData: any) {
  let hasEmptyData = false;
  let frameFields = {};

  // Spread fields value into frame field
  query.fields.map((field) => {
    const data = HandleDataForField(rawData, field);

    // Check if has no data
    if (data === undefined) {
      hasEmptyData = true;
    }

    // Add new field
    frameFields = AddFrameField(frameFields, data, field);
  });

  // Skip if has undefined data
  if (hasEmptyData && query.strict) {
    throw new Error('No data for fields');
  }

  // Add field to frame
  frame.add(frameFields);
}
