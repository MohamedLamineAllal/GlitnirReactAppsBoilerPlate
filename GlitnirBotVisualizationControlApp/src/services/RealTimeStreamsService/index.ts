import eventEmitterService from '../eventEmitterService';
import { ipcClient, IpcClient } from '../ipcClients/glitnirTradingSystem';
import { stores } from '../../stores';

// TODO: this is to be abandoned we don't need that the explanation is bellow! What we need to do is to make all the caching system work through the store! With a helper to manage it! And implement the functionalities within the stores themselves!
/**
 * THE WHY!
 * 
 * the only advantage of having such a service! Is to get the live streams even when the user navigate somewhere else!
 * IT'S BETTER HOWEVER TO implement polling functionality! Rather then keep connecting to streams and caching!
 * 
 * Well in the future if we need any advance functionalities for the best user experience we can have such a service to handle the logic and the features!
 * 
 * Also such a service or class can be implemented as a helper! 
 * so see what is better! Refactor to use this or see what's more fit!
 * 
 * 
 * NOTE: as by now! the steams are directly handled within the view components by themselves!
 * 
 * ANOTHER NOTE! 
 * TODO: check for subscribing to the same endpoint in the ipcClient! If there is any problems implement the future within the ipcClient itself! (when registering check if there is! Add only the callback to the callbacks array! When the event trigger run all the callbacks simple and nice)
 * 
 *  */ 

export class RealTimeStreamsService {
    private _ipcClient: IpcClient;

    constructor(ipcClient: IpcClient) {
        this._ipcClient = ipcClient;
        this.initStreams();
    }

    async initStreams() { 
        this._ipcClient.onLogin(() => {
            this.initBotEngineStreams();

        });
    }

    async initBotEngineStreams() {
        this._ipcClient.on('', () => {

        });
    }
} 
