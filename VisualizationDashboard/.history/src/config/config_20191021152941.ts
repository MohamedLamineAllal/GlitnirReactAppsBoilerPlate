export interface AppConfig {
    ipc: {
        nameSpace: string,
        port?: number,
        processId: string,
        botServiceProcessId: string // this process is a process that is specifically dedicated for external clients [this way we can have some optimization]
    },
    clientsCommunication: {
        deepstream: {
            hostname: string,//'127.0.0.1'
            port: number,
            urlPath: string //'/glitnirComWs'
        },
        streamsConnector: {
            dataEventName: string
        }
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
            botServiceProcessId: 'GLITNIR_BOT_CLIENTS_COMMUNICATION_SERVICE'
        },
        clientsCommunication: {
            deepstream: {
                hostname: '127.0.0.1',
                port: 6050,
                urlPath: '/glitnirDVDComWs'
            },
            streamsConnector: {
                dataEventName: 'visualizationData'
            }
        }
    },
    development: {
        ipc: {
            nameSpace: 'GLITNIR_TRADING.',
            port: 5000,
            processId: 'GLITNIR_CONTROL_VISUALIZATION_APP',
            botServiceProcessId: 'GLITNIR_BOT_CLIENTS_COMMUNICATION_SERVICE'
        },
        clientsCommunication: {
            deepstream: {
                hostname: '127.0.0.1',
                port: 6050,
                urlPath: '/glitnirDVDComWs'
            },
            streamsConnector: {
                dataEventName: 'visualizationData'
            }
        }
    } 
}) as AppConfigWithEnv;