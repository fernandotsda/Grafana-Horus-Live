import { HorusQuery } from './types';
import { DataQueryRequest, dateTime, dateTimeParse } from '@grafana/data';

interface HorusTemplate {
  TEMPLATE_NAME: string;
  TEMPLATE_TYPE: string;
  INTERVAL?: string;
}

/**
 * Transform query template name, type and interval (if selected) into JSON string
 * and overwrite body with it
 * @param query The query
 * @param options Dataquery options
 */
export function SetBodyAsHorusTemplate(query: HorusQuery, options: DataQueryRequest<HorusQuery>): void {
  const horusTemplate: HorusTemplate = {
    TEMPLATE_NAME: query.templateName,
    TEMPLATE_TYPE: query.templateType,
  };

  // Horus Template Body
  if (query.useTimeRangeAsInterval) {
    horusTemplate.INTERVAL = GetCurrentTemplateInterval(options);
  }

  query.body = JSON.stringify(horusTemplate);
}

/**
 * Transform the current dashboard data range in the format yyyy-mm-dd : yyyy-mm-dd
 */
function GetCurrentTemplateInterval(options: DataQueryRequest<HorusQuery>): string {
  const from = dateTimeParse(dateTime(options.range.from)).toDate();
  const to = dateTimeParse(options.range.to).toDate();

  return `${from.getUTCFullYear()}-${twoDigit(from.getUTCMonth() + 1)}-${twoDigit(from.getUTCDate())} : ${twoDigit(
    to.getUTCFullYear()
  )}-${twoDigit(to.getUTCMonth() + 1)}-${twoDigit(to.getUTCDate())}`;
}

/**
 * Add '0' in single digit numbers
 * @param n The number
 * @returns The two digit number as string
 */
function twoDigit(n: number): string {
  return n >= 10 ? `${n}` : '0' + n;
}
