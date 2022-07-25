import { DataSourceInstanceSettings } from '@grafana/data';
import { DataHistory } from './dataHistory';
import { request } from './request';
import { HorusDataSourceOptions, HorusQuery } from './types';

export class DataController {
  private history: DataHistory[] = [];
  private dataRequests: QueryDataGroupRequest[] = [];
  private dataSourceOptions: DataSourceInstanceSettings<HorusDataSourceOptions>;
  /**
   * Set the data capacity and data source options
   */
  constructor(options: DataSourceInstanceSettings<HorusDataSourceOptions>) {
    this.dataSourceOptions = options;
  }

  /**
   * Throws an error if query dataHistoryId is empty or undefined.
   * Try to find an existent DataHistory, if doesn't exist, creates
   * a new one.
   * @param query The current query
   * @returns A DataHistory
   */
  Get(query: HorusQuery): DataHistory {
    const id = query.dataGroupId;
    // Check if query id is empty
    if (id === undefined || id.length === 0) {
      throw new Error('Data history id cannot be empty');
    }

    // Try to find query
    let q = this.Find(id);
    if (!q) {
      q = new DataHistory(id, this.dataSourceOptions.jsonData.dataHistoryCapacity);
      this.history.push(q);
    }

    return q;
  }

  /**
   * Find a DataHistory
   * @param id The DataHistory id
   * @returns The DataHistory, or undefined
   */
  Find(id: string): DataHistory | undefined {
    return this.history.find((h) => h.id === id);
  }

  /**
   * Make the query request, if a request is pending will just wait the result of this one
   * @param query The query
   * @returns
   */
  Request(query: HorusQuery): Promise<any> {
    let r = this.dataRequests.find((r) => r.groupId === query.dataGroupId);

    // Check if is no request wrapper exist for this data group
    if (r === undefined) {
      r = {
        groupId: query.dataGroupId,
        request: undefined,
      };
      this.dataRequests.push(r);
    }

    // Make request if there's no request pending
    if (r.request === undefined) {
      r.request = request(query, this.dataSourceOptions);
    }

    return r.request;
  }

  /**
   * Clear the current request to be able to send new ones
   * @param query The query who wants to
   */
  ClearRequest(query: HorusQuery): void {
    const r = this.dataRequests.find((r) => r.groupId === query.dataGroupId);
    if (r === undefined) {
      throw new Error('Cannot clear a data request of a data group that does not exist');
    }
    // Clear it
    r.request = undefined;
  }
}

interface QueryDataGroupRequest {
  groupId: string;
  request: Promise<any> | undefined;
}
