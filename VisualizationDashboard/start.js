const net = require('net');
const { spawn, exec } = require('child_process');

const port = process.env.PORT ? (process.env.PORT) : 3009;
const host = 'http://localhost';
process.env.ELECTRON_START_URL = `${host}:${port}`;

console.log('================================================================+++++>');
console.log(port);

const npmStartProcess = spawn('npm', ['run', 'start'], {
    stdio: 'inherit'
});
let electronProcess;

const client = new net.Socket();
let connectedAlready = false;

// let startedElectron = false;
const tryConnection = () => {
    console.log('try connection');
    client.connect({
        port
    }, () => {
        console.log('connection in !!!!')
        client.end();

        if (!connectedAlready) {
            connectedAlready = true;
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\nstarting electron\n!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            
            const electronCommand = `ELECTRON_START_URL=${process.env.ELECTRON_START_URL} electron .`;
            console.log(electronCommand);
            
            electronProcess = exec(
                `npx cross-env ELECTRON_START_URL="${process.env.ELECTRON_START_URL}" electron .`, 
                {
                    stdio: 'inherit'
                }
            );
        }
    });
};

tryConnection();

client.on('error', (error) => {
    setTimeout(tryConnection, 1000);
});


process.on('exit', () => {
    console.log('EXIT ==================================');
    npmStartProcess.kill(0);
    if (electronProcess) {
        electronProcess.kill(0);
    }
})