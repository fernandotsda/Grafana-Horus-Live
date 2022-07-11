import defaults from 'lodash/defaults';
import { Observable, merge } from 'rxjs';
import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  LoadingState,
  CircularDataFrame,
  FieldType,
} from '@grafana/data';
import { HorusQuery, HorusDataSourceOptions, defaultQuery } from './types';
import { request } from './request';
import { JSONPath } from 'jsonpath-plus';
import { parseValues } from './parseValues';
import { DataHistory } from './dataHistory';
import { QueryResponseHandler } from './queryResponse';

export class DataSource extends DataSourceApi<HorusQuery, HorusDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<HorusDataSourceOptions>) {
    super(instanceSettings);
    this.dataHistory = new DataHistory(defaultQuery as HorusQuery);
  }

  private dataHistory: DataHistory;

  query(options: DataQueryRequest<HorusQuery>): Observable<DataQueryResponse> {
    const streams = options.targets.map((target) => {
      // Get query
      const query = defaults(target, defaultQuery);

      // Set new query to data history
      this.dataHistory.query = query;

      // Inicialize and return Observable
      return new Observable<DataQueryResponse>((subscriber) => {
        // Inicialize frame
        const frame = new CircularDataFrame({
          append: 'tail',
          capacity: query.capacity,
        });
        frame.refId = query.refId;

        // Add fields
        query.fields.forEach((field) => {
          frame.addField({ name: field.name ?? '', type: field.type });
        });

        // Inicialize subscribe config
        const queryRes = new QueryResponseHandler({
          data: [frame],
          key: query.refId,
          state: LoadingState.NotStarted,
        });

        // Inject data to frame
        this.dataHistory.InjectTo(frame);

        const func = async () => {
          let res: any;
          try {
            res = await request(query);
          } catch (err) {
            return subscriber.error(err);
          }

          // Frame field
          let frameFields = {};
          let hasEmptyData = false;

          // Spread fields value into frame field
          query.fields.map((field) => {
            let data: any;

            try {
              data = parseValues(
                JSONPath({
                  path: field.jsonPath,
                  json: res ?? '',
                }),
                field.type ?? FieldType.string
              )[0];
            } catch {
              subscriber.error('Unsupported field type');
              return;
            }

            if (data === undefined) {
              hasEmptyData = true;
            }

            // Merge fields
            frameFields = {
              ...frameFields,
              // Add new field value
              [field.name ?? '']: data, // Get only the first value
            };
          });

          // Skip if has undefined data
          if (hasEmptyData && query.strict) {
            return subscriber.error('No data for fields');
          }

          // Add field to frame
          frame.add(frameFields);

          // Add to history
          this.dataHistory.Push(frameFields);

          // Call next
          subscriber.next(queryRes.State(LoadingState.Streaming));
        };

        // Execute manually the function to not wait the
        // interval timeout, and then set the interval.
        func();
        const intervalId = setInterval(func, query.interval);

        return () => {
          clearInterval(intervalId);
        };
      });
    });

    return merge(...streams);
  }

  async testDatasource() {
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
