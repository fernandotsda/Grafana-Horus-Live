import { sleep } from './dataHandler';

const curloops: Loop[] = [];

/**
 * Creates a new async function loop, the function
 * will be called after the preview call and the
 * timeout finished
 * @param fn The function that will be executed
 * @param interval The inteval between each call
 * @returns The function to stop de loop
 */
export function Newloop(fn: () => Promise<any>, interval: number): () => void {
  // Create loop
  const loop = new Loop(fn, interval);

  // Save loop
  curloops.push(loop);

  // Return the cancel loop function
  return () => (loop.stop = true);
}

class Loop {
  private _fn: () => Promise<any>;
  private _interval: number;

  stop: boolean;

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
}
