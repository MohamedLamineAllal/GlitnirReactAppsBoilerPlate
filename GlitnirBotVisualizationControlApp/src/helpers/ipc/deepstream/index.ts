import deepstream, { Client as DeepstreamClient } from '@deepstream/client';
import { AuthenticationCallback } from '@deepstream/client/dist/connection/connection';
import { Data, IpcClient } from '../../../services/ipcClients/glitnirTradingSystem';
import { Resolver } from 'dns';

export interface Config {
    inEventsEndPoint: string,
    inRequestsEndPoint: string,
    loginData?: any
}

/**
 * if the client is precised the url will be obsolete!
 * (this allow us to construct multiple classes that share the same client)
 *
 * @class DeepstreamIpcClient
 */

export class DeepstreamIpcClient implements IpcClient {
    private _client: DeepstreamClient;
    private _inEventsEndPoint: string;
    private _inRequestsEndPoint: string;
    private _authenticationCallbacks: AuthenticationCallback[] = [];
    private _loginOptions: any;
    private _onLoginArgs: any[] = [];
    private _onLoginSuccessPromise!: Promise<any>;
    private _onLoginSuccessPromiseResolve!: Function;
    private _onLoginSuccessPromiseReject!: Function;


    constructor(deepstreamServerUrl: string | undefined, config: Config, client?: DeepstreamClient) {
        this._initLoginPromise();

        this._loginOptions = config.loginData;

        if (client) {
            this._client = client; // this use is not advised (unless we have a way to trigger the onLogin if it already happened)
        } else {
            this._client = (deepstream as any)(deepstreamServerUrl);
            
        }
        this._inEventsEndPoint = config.inEventsEndPoint;
        this._inRequestsEndPoint = config.inRequestsEndPoint;
    }

    request(data: Data) {
        return this._client.rpc.make(this._inRequestsEndPoint, data);
    }

    emit(data: Data) {
        this._client.event.emit(this._inEventsEndPoint, data as any);
    }

    on(eventName: string, callback: (data: any) => void) {
        this._client.event.subscribe(eventName, callback);
        return this;
    }

    removeListener(eventName: string, callback: (data: any) => void) {
        this._client.event.unsubscribe(eventName, callback);
        return this;
    }

    login(loginOptions: any): Promise<any> {
        this._initLoginPromise();
        
        this._client.login(loginOptions || this._loginOptions || {}, (...args: any[]) => {
            const success: boolean = args[0];
            const clientData: Object | null = args[1];

            this._onLoginArgs = args;
            for (let authCallback of this._authenticationCallbacks) {
                (authCallback as any)(...args);
            }

            if (success) {
                this._onLoginSuccessPromiseResolve();
            } else {
                this._onLoginSuccessPromiseReject({
                    code: 'LOGIN_FAILED',
                    message: 'Login and authentication failed to deepstream server!'
                });
            }
        });

        return this._onLoginSuccessPromise;
    }

    private _initLoginPromise() {
        this._onLoginSuccessPromise = new Promise((resolve, reject) => {
            this._onLoginSuccessPromiseResolve = resolve;
            this._onLoginSuccessPromiseReject = reject;
        });
    }

    onLogin(callback: AuthenticationCallback) {
        this._authenticationCallbacks.push(callback);

        //__exec immediately if already executed
        if (this._onLoginArgs.length > 0) {
            (callback as any)(...this._onLoginArgs);
        }

        return this;
    }

    async onLoginSuccess() {
        return this._onLoginSuccessPromise;
    }

    //TODO: implement better login state management and event listners
}