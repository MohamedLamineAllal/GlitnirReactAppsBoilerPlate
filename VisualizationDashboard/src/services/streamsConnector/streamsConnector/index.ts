import { StreamConnector } from './interface';
import { DeepstreamConnector } from './deepstream';
export * from './interface';

export enum StreamConnectorType {
    Deepstream
}

export interface StreamConnectorSettings  {
    wsServer: {
        host: string,
        port: number,
        urlPath: string
    },
    dataEventName: string
}

export function createSteamConnector(type: StreamConnectorType, settings :StreamConnectorSettings): StreamConnector {
    switch(type) {
        case StreamConnectorType.Deepstream:
            return new DeepstreamConnector(
                `${settings.wsServer.host}:${settings.wsServer.port}${settings.wsServer.urlPath}`,
                settings.dataEventName
            );
        default:
            throw new Error('Unknown Stream connector type!!!')
    }
}