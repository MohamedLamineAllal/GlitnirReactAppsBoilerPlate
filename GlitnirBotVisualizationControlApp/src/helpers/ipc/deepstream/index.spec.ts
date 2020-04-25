
import { fork, ChildProcess } from 'child_process';
import { DeepstreamIpcClient } from './index';
import config from '../../../config';
import { MixHistoricalDataRequestObj, HistoricalDataType, GetMixHistoricalDataResponse } from '../../../types/ipc';
import { Candle } from '../../../declarations/trading';
import { resolve } from 'bluebird';

let g_dbEngineProcess: ChildProcess;
let g_dataSourceProcess: ChildProcess;
let g_clientsCommunicationEngine: ChildProcess;
let g_deepstreamServer: ChildProcess;
let g_deepstreamClient: DeepstreamIpcClient;
let g_deepstreamServerUrl: string = `${config.clientsCommunication.deepstream.hostname}:${config.clientsCommunication.deepstream.port}${config.clientsCommunication.deepstream.urlPath}`;

beforeAll(() => {
    g_dbEngineProcess = fork('./../../../../../../build/GlitnirBot/db_engine/index.js', undefined, {
        stdio: 'inherit',
    });

    g_dataSourceProcess = fork('./../../../../../../build/GlitnirBot/dataSource/index.js');

    g_clientsCommunicationEngine = fork('./../../../../../../build/GlitnirBot/clientsCommunicationsEngine/index.js', undefined, {
        stdio: 'inherit',
    });

    g_deepstreamServer = fork('./../../../../../../build/GlitnirBot/clientsCommunicationsEngine/deepStreamServer.js', undefined, {
        stdio: 'inherit',
    });
    let deepstreamLoginPromiseResolver: any;
    let deepstreamLoginPromiseRejecter: any;
    let deepstreamLoginPromise: Promise<any> = new Promise((resolve, reject) => {
        deepstreamLoginPromiseResolver = resolve;
        deepstreamLoginPromiseRejecter = reject;
    });

    g_deepstreamClient = new DeepstreamIpcClient(g_deepstreamServerUrl, {
        inEventsEndPoint: config.clientsCommunication.inEventsEndPoint,
        inRequestsEndPoint: config.clientsCommunication.inRequestsEndPoint,
        loginData: {}
    })
    .onLogin((success: boolean, clientData: any) => {
        console.log(' !!!!!!!!!!!!!!!!!!!!!!!!!')
        console.log('Deepstream login callback !!!!!!!!!!!!!!!!!!!!!!!!!')
        console.log(' !!!!!!!!!!!!!!!!!!!!!!!!!')
        console.log(' !!!!!!!!!!!!!!!!!!!!!!!!!')
        console.log(' !!!!!!!!!!!!!!!!!!!!!!!!!')
        console.log({
            success,
            clientData
        });

        if (success) {
            deepstreamLoginPromiseResolver();
        } else {
            deepstreamLoginPromiseRejecter();
        }
    });

    return Promise.all([
        new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 20000);
        }),
        deepstreamLoginPromise
    ])
    .then(() => {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!SETUP FINISHED !!!!')
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!SETUP FINISHED !!!!')
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!SETUP FINISHED !!!!')
        console.log('SETUP FINISHED !!!!')
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!SETUP FINISHED !!!!')
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!SETUP FINISHED !!!!')
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!SETUP FINISHED !!!!')
    });
}, 300000);


// test('inEventsEndPoint', async () => {
    
// }, 300000);

test('inRequestEndPoint', async () => {
    console.log('==============================')
    console.log('==============================')
    console.log('==============================')
    console.log('==============================')
    console.log('===============in request end point !!!!!!! req ===============')
    console.log('==============================')
    console.log('==============================')
    console.log('==============================')
    console.log('==============================')
    console.log('==============================')
    const response: GetMixHistoricalDataResponse = await g_deepstreamClient.request({
        eventName: 'GET_MIX_HISTORICAL_DATA',
        data: {
            exchange: 'Binance',
            symbol: 'BTCUSDT',
            interval: '5m',
            userId: 3,
            processId: 5,
            startTime: new Date('2019-01-01').getTime(),
            endTime: new Date('2019-02-01').getTime(),
            dataToRequest: [HistoricalDataType.Candles]
        } as MixHistoricalDataRequestObj,
        processId: config.ipc.dbEngineProcessId
    });

    if (response) {
        expect((response.candles as Candle[]).length > 0).toBeTruthy();
    } else {
        console.log(response)
        throw new Error('no response')
    }
}, 300000);