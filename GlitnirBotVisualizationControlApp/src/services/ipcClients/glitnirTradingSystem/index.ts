import config from '../../../config';

import { DeepstreamIpcClient } from '../../../helpers/ipc/deepstream';

export interface Data {
    eventName: string,
    data: any,
    processId?: string
}


export interface IpcClient {
    request(data: Data): Promise<any>;
    emit(data: Data): void;
    on(eventName: string, callback: (data: any) => void): void;
    removeListener(eventName: string, callback: (data: any) => void) : void;
    login(loginOptions: any): Promise<any>;
    onLogin(callback: Function): IpcClient;
    onLoginSuccess(): Promise<any>;
}

let deepstreamServerUrl: string = `${config.clientsCommunication.deepstream.hostname}:${config.clientsCommunication.deepstream.port}${config.clientsCommunication.deepstream.urlPath}`;


export const ipcClient = new DeepstreamIpcClient(
    deepstreamServerUrl,
    {
        inEventsEndPoint: config.clientsCommunication.inEventsEndPoint,
        inRequestsEndPoint: config.clientsCommunication.inRequestsEndPoint,
        loginData: {}
    }
);

/**
 * if you add support for another communication library!
 * you can create a factory or switch the library here !!!!!!
 */