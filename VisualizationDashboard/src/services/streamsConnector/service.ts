import config from '../../config';

import { createSteamConnector, StreamConnectorType, StreamData } from './streamsConnector';

import { eventEmitterService, globalState } from '../../.';
import Deepstream from '@deepstream/server';
import { DeepstreamForkedServer } from './streamsConnector/deepstream/server';


export const DEEPSTREAM_SERVER_STARTED_EVENT = "DEEPSTREAM_SERVER_STARTED",
    DEEPSTREAM_SERVER_STOPPED_EVENT = "DEEPSTREAM_SERVER_STOPPED",
    DEEPSTREAM_CLIENT_CONNECTED_EVENT = "DEEPSTREAM_CLIENT_CONNECTED";

/**
 * later we manage multiple streams tools! And remote stream server ! And config for that! 
 */
const deepstreamServerOptions = {
    host: config.clientsCommunication.deepstream.hostname,
    port: config.clientsCommunication.deepstream.port,
    urlPath: config.clientsCommunication.deepstream.urlPath
};

const dataEventName = config.clientsCommunication.streamsConnector.dataEventName;

export function startStreamConnectorService() {
    //___________start deepstream server
    let deepstreamServer: DeepstreamForkedServer | undefined = undefined;
    
    if (window.require) {
        console.log('-----------------> window.require  ININININININ')
        console.log(__dirname)
        const path = window.require('path');
        const { DeepstreamForkedServer } = require('./streamsConnector/deepstream/server');
        const { fork } = window.require('child_process');
        console.log('!!!!!!!!!!!!!!!!!!!!!!!! startServer !!!!!!!!!!!!');

        deepstreamServer = new DeepstreamForkedServer(deepstreamServerOptions) as DeepstreamForkedServer;

        console.log(deepstreamServer);

        deepstreamServer.on('started', () => {
            console.log('Server started');
            globalState.deepstreamServerActive = true;
            eventEmitterService.emit(DEEPSTREAM_SERVER_STARTED_EVENT, true);
        });
        deepstreamServer.on('stopped', () => {
            console.log('Server stopped');
            globalState.deepstreamServerActive = false;
            eventEmitterService.emit(DEEPSTREAM_SERVER_STOPPED_EVENT, true);
        })
            
        console.log({
            deepstreamServerOptions,
            deepstreamServer
        });
    } else {
        console.log('-----------------> window.require undefined')
    }
    
    //__________launch the connector and manage the data
    const streamsConnector = createSteamConnector(StreamConnectorType.Deepstream, {
        wsServer: deepstreamServerOptions,
        dataEventName
    })
    .onData((data: StreamData) => {
        eventEmitterService.emit(dataEventName, data);
    })
    .onStreamConnection(() => {
        console.log('STREAM CONNECTED !!!!!!!!!!!!!!!')
        globalState.deepstreamClientConnected = true;
        eventEmitterService.emit(DEEPSTREAM_CLIENT_CONNECTED_EVENT, true);
    });

    return {
        deepstreamServer,
        streamsConnector
    }
}