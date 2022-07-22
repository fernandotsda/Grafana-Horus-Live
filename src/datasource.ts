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
import shortUUID from 'short-uuid';
import { Newloop as NewLoop } from './looper';

export class DataSource extends DataSourceApi<HorusQuery, HorusDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<HorusDataSourceOptions>) {
    super(instanceSettings);
    this.dataController = new DataController();
  }

  private dataController: DataController;

  query(options: DataQueryRequest<HorusQuery>): Observable<DataQueryResponse> {
    const streams = options.targets.map((target) => {
      // Get query
      const query = defaults(target, defaultQuery);

      // Create unic groupID
      if (query.dataGroupId.length === 0) {
        query.dataGroupId = shortUUID.generate().toString();
      }

      // Get data history
      const dataHistory = this.dataController.Get(query);

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
        if (query.keepdata) {
          dataHistory.InjectTo(frame, query);
        }

        const func = async () => {
          let res: any;
          let error = false;

          // Make fetch
          try {
            // Wait and clone response
            res = clone(await this.dataController.Request(query));
          } catch (e) {
            subscriber.error(e);
            error = true;
          } finally {
            // Clear request
            this.dataController.ClearRequest(query);
            if (error) {
              return;
            }
          }

          // Add data to frame
          try {
            AddDataToQueryFrame(frame, query, res);
          } catch (e) {
            subscriber.error(e);
          }

          // Add data to history
          if (query.keepdata) {
            dataHistory.Push(res);
          }

          // Call next handler
          subscriber.next(queryRes.State(LoadingState.Streaming));
        };

        return NewLoop(func, query.interval);
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
