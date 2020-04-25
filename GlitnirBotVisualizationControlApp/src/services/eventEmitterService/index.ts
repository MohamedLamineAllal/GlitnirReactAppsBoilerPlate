import EventEmitter from "events";

class EventEmitterService {
  public eventEmitter: EventEmitter;
  /**
   * Initiate the event emitter
   */
  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  /**
   * Adds the @listener function to the end of the listeners array
   * for the event named @eventName
   * Will ensure that only one time the listener added for the event
   *
   * @param {string} eventName
   * @param {function} listener
   */
  public on(eventName: string, listener: any) {
    this.eventEmitter.on(eventName, listener);
  }

  /**
   * Will remove the specified @listener from @eventName list
   *
   * @param {string} eventName
   * @param {function} listener
   */
  public removeEventListener(eventName: string, listener: any) {
    this.eventEmitter.removeListener(eventName, listener);
  }

  /**
   * Will emit the event on the event name with the @payload
   * and if its an error set the @error value
   *
   * @param {string} event
   * @param {object} payload
   * @param {boolean} error
   */
  public emit(event: string, payload: any, error = false) {
    this.eventEmitter.emit(event, payload, error);
  }

  /**
   * Returns the event emitter
   * Used for testing purpose and avoid using this during development
   */
  public getEventEmitter() {
    return this.eventEmitter;
  }
}

export default new EventEmitterService();
