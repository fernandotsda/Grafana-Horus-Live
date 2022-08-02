import { DataSourceInstanceSettings } from '@grafana/data';
import { DataHistory } from './dataHistory';
import { RequestResult, _request } from './request';
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
  GetDataHistory(query: HorusQuery): DataHistory | null {
    // Return null if keep data is disabled
    if (query.keepdata === false) {
      return null;
    }
    const id = query.dataGroupId;

    // Find data history
    let dataHistory = this.Find(id);

    // Creates a new one if doesn't exists
    if (dataHistory === null) {
      dataHistory = new DataHistory(id, this.dataSourceOptions.jsonData.dataHistoryCapacity);

      // Save data history for possible new queries
      // of the same data group.
      this.history.push(dataHistory);
    }

    return dataHistory;
  }

  /**
   * Find a DataHistory
   * @param id The DataHistory id
   * @returns The DataHistory, or undefined
   */
  Find(id: string): DataHistory | null {
    return this.history.find((h) => h.id === id) ?? null;
  }

  /**
   * Make query request, if a request is pending will just wait the result
   * @param query The query
   * @returns
   */
  Request(query: HorusQuery): Promise<RequestResult> {
    let dataRequest = this.dataRequests.find((r) => r.groupId === query.dataGroupId);
    // Check if is no request wrapper exist for this data group
    if (dataRequest === undefined) {
      dataRequest = {
        groupId: query.dataGroupId,
        result: undefined,
      };
      this.dataRequests.push(dataRequest);
    }

    // Make request if there's no request pending
    if (dataRequest.result === undefined) {
      dataRequest.result = _request(query, this.dataSourceOptions);
      this.SaveResponse(dataRequest); // Save response in data history
    }

    return dataRequest.result;
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
    r.result = undefined;
  }

  /**
   * Save response on Data history.
   * If Data history is null, will do
   * nothing.
   * @param req The query request
   */
  private async SaveResponse(req: QueryDataGroupRequest): Promise<void> {
    // Get data history
    const dataHistory = this.Find(req.groupId);

    // Just return if there's no data history
    if (dataHistory === null) {
      return;
    }

    // Wait for response
    const res = await req.result;

    // Push new data if is valid
    if (res !== undefined && res.data !== undefined && res.error === null) {
      dataHistory.Push(res);
    }
  }
}

interface QueryDataGroupRequest {
  groupId: string;
  result: Promise<RequestResult> | undefined;
}
