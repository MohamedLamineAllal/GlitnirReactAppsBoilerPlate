import { createReadStream } from "fs";

const { fork } = window.require('child_process'); 
const path = window.require('path');
// const electron = window.require('electron');

export interface DeepstreamServerOptions {
    host: string,
    port: number,
    urlPath: string
}

export interface DeepstreamForkedServerEvents {
    started?: () => void
    stopped?: () => void
}

const EVENTS_LIST: keyof DeepstreamForkedServerEvents = ['started', 'stopped'] as any;
console.log('__dirname !!!=====')
console.log(__dirname)

export class DeepstreamForkedServer  {
    private _serverProcess: any;
    private _events: DeepstreamForkedServerEvents = {};

    constructor(options: DeepstreamServerOptions) {
        console.log('FORK !!!!!!!!!!!!!!!!!=======================>')
        this._serverProcess = fork(
            './src/services/streamsConnector/streamsConnector/deepstream/serverForkScript.js', 
            {
                stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
                env: {
                    options: JSON.stringify(options)
                }
            }
        );

        this._handleIpcMessages();
        this._handleProcessError();
        this._handleLogging();
    }

    private _handleIpcMessages() {
        this._serverProcess.on('message', (value: any) => {
            if (typeof value === 'string') {
                switch(value) {
                    case 'started':
                        this._execEvent('started');
                        break;
                    case 'stopped':
                        this._execEvent('stopped');
                        break; 
                }
            } else {
                switch(value.event) {
                    case 'log': 
                        console.log(value.data);
                        break;
                    case 'error':
                        console.error(value.data);
                        break;
                }
            }
        });
    }


    private _handleProcessError() {
        this._serverProcess.on('exit', (code: any, signal: any) => {
            console.log('exit =====================================')
            console.log(code);
            console.log(signal);
        });
        
        this._serverProcess.on('error', (err: any) => {
            console.log('=============================================ERRROR')
            console.log(err);
        }); 

        this._serverProcess.stderr.on('data', (data: any) => {
            console.log('stderr: ' + data);
        })

    }

    private _handleLogging() {
        this._serverProcess.stdout.on('data', (data: any) => {
            console.log('stdout: ' + data);
        });
    }

    on(event: keyof DeepstreamForkedServerEvents, callback: any) {
        if (EVENTS_LIST.includes(event)) {
            this._events[event] = callback;
        } else {
            throw new Error('Wrong event provided !!')
        }

        return this;
    }

    private _execEvent(event: keyof DeepstreamForkedServerEvents, ...args: any) {
        if (this._events[event]) {
            (this._events[event] as Function)(...args);
        }
    }
}