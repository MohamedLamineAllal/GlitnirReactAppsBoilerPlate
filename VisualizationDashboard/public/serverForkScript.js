const { Deepstream } = require('@deepstream/server');
const options = JSON.parse(process.env.options);

console.log('FORKED PROCESS SERVER DEEPSTREAM');
console.log(options)

process.send({
    event: 'log',
    data: 'FORKED PROCESS SERVER DEEPSTREAM'
});

process.send({
    event: 'log',
    data: options
});

const webSocketServer = new Deepstream({
    connectionEndpoints: [
        {
            type: 'ws-websocket',
            options
        }
    ]
});

webSocketServer.start();

//________________________________handle events

webSocketServer.on('started', () => {
    process.send('started');
});

webSocketServer.on('stopped', () => {
    process.send('stopped');
});
