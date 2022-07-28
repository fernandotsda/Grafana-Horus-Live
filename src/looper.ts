import { sleep } from './dataHandler';
import { TeardownLogic } from 'rxjs';

/**
 * When intanciated, creates a new async function, the function
 * will be called after the preview call and the
 * timeout finished.
 */
export class Loop {
  private _fn: () => Promise<any>;
  private _interval: number;
  private stop: boolean;

  constructor(fn: () => Promise<any>, interval: number) {
    this._fn = fn;
    this._interval = interval;

    this.stop = false;

    this.start();
  }

  private async start() {
    while (this.stop === false) {
      await this._fn();
      await sleep(this._interval);
    }
  }

  get TeardownLogic(): TeardownLogic {
    return () => {
      this.stop = true;
    };
  }
}
