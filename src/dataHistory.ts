import { CircularDataFrame } from '@grafana/data';
import { AddDataToQueryFrame } from './dataHandler';
import { RequestResult } from './request';
import { HorusQuery } from './types';

export class DataHistory {
  readonly id: string;
  private capacity: number;
  private data: RequestResult[] = [];

  constructor(id: string, capacity: number) {
    this.id = id;
    this.capacity = capacity;
  }

  /**
   * If history data is bigger than the query capacity, the
   * old data will be discarted. If keep data is disabled,
   * the history data will be cleared.
   * @param frame The frame that will receive the data.
   */
  InjectTo(frame: CircularDataFrame<any>, query: HorusQuery): void {
    // Check if data exceeds the query capacity
    if (this.capacity < this.data.length) {
      const count = this.data.length - this.capacity;
      this.data.splice(0, count);
    }

    const dataLenght = this.data.length;

    // Get the startIndex
    let startIndex = dataLenght - query.capacity;
    if (startIndex < 0) {
      startIndex = 0;
    }
    // Inject the last values
    for (let i = startIndex; i < dataLenght; i++) {
      try {
        AddDataToQueryFrame(frame, query, this.data[i].data);
      } catch {} // Just skip fails
    }
  }

  /**
   * Add data to history. If the current history is bigger
   * the the query capacity, the oldest data will be discarted.
   * @param data The data.
   */
  Push(data: any) {
    this.data.push(data);

    // Check if data has reached the maximum capacity
    if (this.data.length > this.capacity) {
      this.data.shift();
    }
  }
}
