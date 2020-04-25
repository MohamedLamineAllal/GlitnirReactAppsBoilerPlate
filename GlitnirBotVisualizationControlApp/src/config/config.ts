import { DB_ENGINE_EVENTS, DbEngineEvents, BackTestingEngineEvents, BACK_TESTING_EVENTS, BotEngineEvents, BOT_ENGINE_EVENTS } from './events';

export interface AppConfig {
    ipc: {
        nameSpace: string,
        port?: number,
        processId: string,
        clientsCommunicationProcessId: string, // communication service
        dbEngineProcessId: string,
        dataSourceProcessId: string,
        botEngineProcessId: string,
        backTestingEngineProcessId: string,
        ipcEvents: {
            dbEngine: {
                [index in keyof DbEngineEvents]: string
            },
            backTestingEngine: {
                [index in keyof BackTestingEngineEvents]: string
            },
            botEngine: {
                [index in keyof BotEngineEvents]: string
            }
        }
    },
    clientsCommunication: {
        deepstream: {
            hostname: string,//'127.0.0.1'
            port: number,
            urlPath: string //'/glitnirComWs'
        },
        inEventsEndPoint: string,
        inRequestsEndPoint: string,
        multipleEventsQueryEvent: string,
        multipleRequestsQueryEvent: string
    }
}

export interface AppConfigWithEnv  {
    production?: AppConfig,
    development?: AppConfig,
    testing?: AppConfig,
    [env: string]: AppConfig | undefined
}

export default ({
    production: {
        ipc: {
            nameSpace: 'GLITNIR_TRADING.',
            port: 5000,
            processId: 'GLITNIR_CONTROL_VISUALIZATION_APP',
            clientsCommunicationProcessId: 'GLITNIR_BOT_CLIENTS_COMMUNICATION_SERVICE',
            dbEngineProcessId: 'GLITNIR_DB_ENGINE',
            dataSourceProcessId: 'GLITNIR_DATASOURCE_ENGINE',
            botEngineProcessId: 'GLITNIR_BOT_ENGINE',
            backTestingEngineProcessId: 'BACK_TESTING_ENGINE',
            ipcEvents: {
                dbEngine: DB_ENGINE_EVENTS,
                backTestingEngine: BACK_TESTING_EVENTS,
                botEngine: BOT_ENGINE_EVENTS
            }
        },
        clientsCommunication: {
            deepstream: {
                hostname: '127.0.0.1',
                port: 6020,
                urlPath: '/glitnirComWs'
            },
            inEventsEndPoint: 'glitnirIpcBroker/event',
            inRequestsEndPoint: 'glitnirIpcBroker/request',
            multipleEventsQueryEvent: 'multipleInEvents',
            multipleRequestsQueryEvent: 'multipleInRequests'
        }
    },
    development: {
        ipc: {
            nameSpace: 'GLITNIR_TRADING.',
            port: 5000,
            processId: 'GLITNIR_CONTROL_VISUALIZATION_APP',
            clientsCommunicationProcessId: 'GLITNIR_BOT_CLIENTS_COMMUNICATION_SERVICE',
            dbEngineProcessId: 'GLITNIR_DB_ENGINE',
            dataSourceProcessId: 'GLITNIR_DATASOURCE_ENGINE',
            botEngineProcessId: 'GLITNIR_BOT_ENGINE',
            backTestingEngineProcessId: 'BACK_TESTING_ENGINE',
            ipcEvents: {
                dbEngine: DB_ENGINE_EVENTS,
                backTestingEngine: BACK_TESTING_EVENTS,
                botEngine: BOT_ENGINE_EVENTS    
            }
        },
        clientsCommunication: {
            deepstream: {
                hostname: '127.0.0.1',
                port: 6020,
                urlPath: '/glitnirComWs'
            },
            inEventsEndPoint: 'glitnirIpcBroker/event',
            inRequestsEndPoint: 'glitnirIpcBroker/request',
            multipleEventsQueryEvent: 'multipleInEvents',
            multipleRequestsQueryEvent: 'multipleInRequests'
        }
    } 
}) as AppConfigWithEnv;