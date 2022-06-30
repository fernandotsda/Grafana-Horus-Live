import { CircularDataFrame } from '@grafana/data';
import { HorusQuery } from './types';

export class DataHistory {
  private _data: any[];
  query: HorusQuery;

  constructor(query: HorusQuery) {
    this.query = query;
    this._data = [];
  }

  /**
   * Inject data to the frame if query keep data is enabled.
   * If history data is bigger than the query capacity, the
   * old data will be discarted. If keep data is disabled,
   * the history data will be cleared.
   * @param frame The frame that will receive the data.
   */
  Inject(frame: CircularDataFrame<any>): void {
    // Check if keep data is enabled
    if (!this.query.keepdata) {
      // Clear data
      this._data = [];
      return;
    }

    // Check if data exceeds the query capacity
    if (this.query.capacity < this._data.length) {
      const count = this._data.length - this.query.capacity;
      this._data.splice(0, count);
    }

    // Add frames
    this._data.map((d) => frame.add(d));
  }

  /**
   * Add data to history. If the current history is bigger
   * the the query capacity, the oldest data will be discarted.
   * If keep data is disabled, the data will be ignored.
   * @param data The data.
   */
  Push(data: any) {
    // Check if keep data is desabled
    if (!this.query.keepdata) {
      return;
    }
    this._data.push(data);

    // Check if data has reached the maximum capacity
    if (this._data.length > this.query.capacity) {
      this._data.shift();
    }
  }
}
