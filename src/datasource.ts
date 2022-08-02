import defaults from 'lodash/defaults';
import { Observable, merge } from 'rxjs';
import clone from 'just-clone';
import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  LoadingState,
  CircularDataFrame,
} from '@grafana/data';
import { HorusQuery, HorusDataSourceOptions, defaultQuery } from './types';
import { QueryResponseHandler } from './queryResponse';
import { DataController } from './dataController';
import { AddDataToQueryFrame } from './dataHandler';
import { Loop } from './looper';
import { RequestResult } from './request';
import { GetCurrentTemplateInterval } from './templateInterval';
import shortUUID from 'short-uuid';

export class DataSource extends DataSourceApi<HorusQuery, HorusDataSourceOptions> {
  private dataController: DataController;

  constructor(instanceSettings: DataSourceInstanceSettings<HorusDataSourceOptions>) {
    super(instanceSettings);
    this.dataController = new DataController(instanceSettings);
  }

  query(options: DataQueryRequest<HorusQuery>): Observable<DataQueryResponse> {
    const streams = options.targets.map((target) => {
      // Get query
      const query = defaults(target, defaultQuery);

      // Horus Template Body
      if (query.useHorusTemplateBody) {
        if (query.useTimeRangeAsInterval) {
          query.horusTemplate.INTERVAL = GetCurrentTemplateInterval(options);
        }
        query.body = JSON.stringify(query.horusTemplate);
      }

      // Create new dataGroupId if empty
      if (query.dataGroupId.length === 0) {
        query.dataGroupId = shortUUID.generate();
      }

      // Inicialize and return Observable
      return new Observable<DataQueryResponse>((subscriber) => {
        // Get data history
        const dataHistory = this.dataController.GetDataHistory(query);

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
        if (query.keepdata && dataHistory !== null) {
          dataHistory.InjectTo(frame, query);
        }

        // Request error count
        let requestErrCount = 0;

        const func = async () => {
          let res: RequestResult | undefined;
          let fatalErr = false;
          try {
            // Wait and clone response
            res = clone(await this.dataController.Request(query));

            if (res.error !== null) {
              requestErrCount++;
              // Check if errCount has reached the limit
              if (requestErrCount >= 10) {
                subscriber.error(res.error);
              }
            } else {
              requestErrCount = 0;
            } // Reset count on success
          } catch (e) /* Catch fatal errors */ {
            fatalErr = true;
            subscriber.error(e);
          } finally {
            // Clear request
            this.dataController.ClearRequest(query);

            // Return if anything went wrong
            if (fatalErr === true || res === undefined || res.error !== null) {
              return;
            }
          }

          // Add data to frame
          try {
            AddDataToQueryFrame(frame, query, res.data);
          } catch (e) {
            subscriber.error(e);
          }

          // Call next handler
          subscriber.next(queryRes.State(LoadingState.Streaming));
        };

        // Start loop
        const loop = new Loop(func, query.interval);
        return loop.TeardownLogic;
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
