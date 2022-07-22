import { DataHistory } from './dataHistory';
import { request } from './request';
import { HorusQuery } from './types';

export class DataController {
  private history: DataHistory[] = [];
  private dataRequests: QueryDataGroupRequest[] = [];

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
      q = new DataHistory(id, 2000);
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

  Request(query: HorusQuery): Promise<any> {
    let r = this.dataRequests.find((r) => r.groupId === query.dataGroupId);

    // Check if not registered
    if (r === undefined) {
      r = {
        groupId: query.dataGroupId,
        request: undefined,
      };
      this.dataRequests.push(r);
    }

    // Make request if there's no request happening
    if (r.request === undefined) {
      r.request = request(query);
    }

    return r.request;
  }

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
