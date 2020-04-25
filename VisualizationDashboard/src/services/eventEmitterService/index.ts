import EventEmitter from 'events'

export type EventCallback = (...args: any[]) => void

class EventEmitterService {
  private _eventEmitter: EventEmitter;
    /**
         * Initiate the event emitter
         */
      constructor() {
        this._eventEmitter = new EventEmitter();
      }
    
    /**
         * Adds the @listener function to the end of the listeners array
         * for the event named @eventName
         * Will ensure that only one time the listener added for the event
         *
         * @param {string} eventName
         * @param {function} listener
         */
      on(eventName: string, listener: EventCallback) {
        this._eventEmitter.on(eventName, listener); 
      }
    
    /**
         * Will remove the specified @listener from @eventName list
         *
         * @param {string} eventName
         * @param {function} listener
         */
      removeEventListener(eventName: string, listener: EventCallback) {
        this._eventEmitter.removeListener(eventName, listener);
      }
    
    /**
       * Will emit the event on the event name with the @payload
       * and if its an error set the @error value
       *
       * @param {string} event
       * @param {object} payload
       * @param {boolean} error
       */
      emit(event: string, payload: any, error = false) {
        this._eventEmitter.emit(event, payload, error);
      }
    
    /**
         * Returns the event emitter
         * Used for testing purpose and avoid using this during development
         */
      getEventEmitter() {
        return this._eventEmitter;
      }
    }

export default new EventEmitterService();