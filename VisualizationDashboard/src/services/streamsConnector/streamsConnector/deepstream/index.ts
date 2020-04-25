import deepstream, { Client as DeepstreamClient } from '@deepstream/client';
import { StreamConnector, OnDataCallback, StreamData } from '../interface';

export class DeepstreamConnector extends StreamConnector {
    private _client: DeepstreamClient;
    private _onDataCallback!: OnDataCallback;
    private _dataEventName: string;
    private _onStreamConnectionCallback!: () => void;

    constructor(serverUrl: string, dataEventName: string, loginOption: any = {}) {
        super();
        this._client = (deepstream as any)(serverUrl);
        this._client.login(loginOption, () => {
            if (this._onStreamConnectionCallback) this._onStreamConnectionCallback();
        });
        this._dataEventName = dataEventName;
    }

    private _subscribeToEvent() {
        this._client.event.subscribe(this._dataEventName, (data: any) => {
            this._onDataCallback(data as StreamData);
        });
    }

    onData (callback: OnDataCallback) {
        const alreadySubscribed = !!this._onDataCallback;
        this._onDataCallback = callback;
        if (!alreadySubscribed) {
            this._subscribeToEvent();
        }
        return this;
    }

    onStreamConnection(callback: () => void) {
        this._onStreamConnectionCallback = callback;
        return this;
    }
} 
