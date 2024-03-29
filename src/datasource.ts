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
import shortUUID from 'short-uuid';
import { SetBodyAsHorusTemplate } from './horusTemplate';
import { OverrideQueryWithVariables } from './variableHandler';

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

      // Inicialize and return Observable
      return new Observable<DataQueryResponse>((subscriber) => {
        // Override query fields with dashboard variables
        if (!query.unoverridable) {
          try {
            OverrideQueryWithVariables(query);
          } catch (e) {
            subscriber.error(e);
          }
        }

        // Use template name as DataGroupId
        if (query.useTemplateNameAsDataGroupId) {
          query.dataGroupId = query.templateName;
        }

        // Create new dataGroupId if empty
        if (query.dataGroupId.length === 0) {
          query.dataGroupId = shortUUID.generate();
        }

        // Use horus template
        if (query.useHorusTemplateBody) {
          SetBodyAsHorusTemplate(query, options);
        }

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
          state: LoadingState.Loading,
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
              if (requestErrCount > query.maxFails) {
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

        // Fast start
        if (query.fastStart) {
          subscriber.next(queryRes.State(LoadingState.Streaming));
        }

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
