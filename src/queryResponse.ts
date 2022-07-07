import { DataQueryResponse, LoadingState } from '@grafana/data';

export class QueryResponseHandler {
  private _res: DataQueryResponse;
  /**
   *  Inicialize config
   */
  constructor(res: DataQueryResponse) {
    this._res = res;
  }

  /**
   * Override the data query response state.
   * @param state New state
   * @returns New data query
   */
  State(state: LoadingState): DataQueryResponse {
    this._res.state = state;
    return this._res;
  }
}
