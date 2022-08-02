import { DataQueryRequest, dateTime, dateTimeParse } from '@grafana/data';
import { HorusQuery } from './types';

export function GetCurrentTemplateInterval(options: DataQueryRequest<HorusQuery>): string {
  const from = dateTimeParse(dateTime(options.range.from)).toDate();
  const to = dateTimeParse(options.range.to).toDate();

  return `${from.getUTCFullYear()}-${twoDigit(from.getUTCMonth() + 1)}-${twoDigit(from.getUTCDate())} : ${twoDigit(
    to.getUTCFullYear()
  )}-${twoDigit(to.getUTCMonth() + 1)}-${twoDigit(to.getUTCDate())}`;
}

function twoDigit(n: number): string {
  return n > 10 ? `${n}` : '0' + n;
}
