import { stores, StoresContext } from '../stores'; 
import { ipcClient, Data } from '../services/ipcClients/glitnirTradingSystem';
import config from '../config';
import { User, Process } from '../stores/RootStore/types';
import { MultiQueryOneResponseObj } from '../types/ipc';

const dbEngineEvents = config.ipc.ipcEvents.dbEngine;

type InitQueryResult = [
    User[], // connected user shared users
    Process[] // connected user processes (not deleted only)
];


function initStoresQueryList(stores: StoresContext): Data[] {
    return [
        {
            eventName: dbEngineEvents.GET_USER_SHARED_USERS,
            data: (stores.rootStore.domain.connectedUser as User || {}).id,
            processId: config.ipc.dbEngineProcessId
        },
        {
            eventName: dbEngineEvents.GET_PROCESSES_BY_USER,
            data: (stores.rootStore.domain.connectedUser as User || {}).id,
            processId: config.ipc.dbEngineProcessId
        }
    ];
}

function initStores(initQueryResult: InitQueryResult) {
    const [
        currentUserSharedUsers,
        currentUserProcesses
    ] = initQueryResult;

    console.log('||||-----INIT STORES ====================>')

    initStores_initCurrentUserSharedUsers(currentUserSharedUsers);
    initStores_initCurrentUserProcesses(currentUserProcesses);
    // initStores_initTradingViewStore();
    // initStores_initBackTestingStore();
    console.log("========Stores initiated===========");
    console.log(JSON.parse(JSON.stringify(stores.rootStore.domain.users)));
    console.log(JSON.parse(JSON.stringify(stores.rootStore.domain.processes)));
}

function initStores_initCurrentUserSharedUsers(currentUserSharedUsers: User[]) {
    for (let user of currentUserSharedUsers) {
        stores.rootStore.domain.users[user.id] = user;
    }
}

function initStores_initCurrentUserProcesses(currentUserProcesses: Process[]) {
    const currentUser = stores.rootStore.domain.connectedUser as User;

    for (let process of currentUserProcesses) {
        //__________ store processes
        stores.rootStore.domain.processes[process.id as string] = process;
        //___________ store user processes relations
        if (Array.isArray(stores.rootStore.domain.usersProcesses[currentUser.id])) {
            stores.rootStore.domain.usersProcesses[currentUser.id].push(process.id as number);
        } else {
            stores.rootStore.domain.usersProcesses[currentUser.id] = [process.id as number];
        }
    }   
}

// ________________________________ init 

// /**
//  * this is expected to run after the rootStore users and processes sta&tes are initiated
//  */
// function initStores_initTradingViewStore() {
//     const currentUser = stores.rootStore.domain.connectedUser as User;
//     const processesIds = stores.rootStore.domain.usersProcesses[currentUser.id];
    
//     if (Array.isArray(processesIds) && processesIds.length > 0) {
//         stores.tradingViewStore.domain.processesList = processesIds;
//     }
// }

// function initStores_initBackTestingStore() {
//     const currentUser = stores.rootStore.domain.connectedUser as User;
//     const processesIds = stores.rootStore.domain.usersProcesses[currentUser.id];
//     if (Array.isArray(processesIds) && processesIds.length > 0) {
//         stores.backTestingStore.domain.processesList = processesIds;
//     }
// }

export async function initApp () {
    try {
        console.log("-------------------------> init app")
        await ipcClient.onLoginSuccess();

        console.log("YOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYO")

        /**
         * Making sure the client is connected
         */
        console.log('GET GLITNIR USER');
        let getUserResponse: User[] | undefined;
        
        try {
            getUserResponse = (await ipcClient.request({
                eventName: config.ipc.ipcEvents.dbEngine.GET_USERS_BY_USER_NAMES,
                data: 'glitnir', //<----------------|temporal connecting using glitnir (system user)
                processId: config.ipc.dbEngineProcessId
            }) as User[]);
        } catch(err) {
            console.log(err);
        }

        console.log(getUserResponse);
        if (getUserResponse) {
            stores.rootStore.domain.connectedUser = (getUserResponse[0]); // TODO: strip that and have a real authentication and connection implemented (you get the user data from there!)
            
            console.log('Connected user initiated : ');
            
            console.log(getUserResponse);
    
            //____________________init stores
            console.log('--------------------init stores !!!!');

            const multiQueryResults = await ipcClient.request({
                eventName: config.clientsCommunication.multipleRequestsQueryEvent,
                data: [
                    ...initStoresQueryList(stores)
                ] as Data[]
            }) as MultiQueryOneResponseObj[];

    
            console.log(multiQueryResults);
    
            if (
                multiQueryResults[0].state === 'success' && multiQueryResults[1].state === 'success'
            ) {
                initStores(multiQueryResults.map((result) => result.response) as [User[], Process[]]);
            }
        }
    } catch(err) {
        console.error(err);
        if (err.code === 'LOGIN_FAILED') {
            // manage when the login fail !!!!
            console.log('LOGIN FAILED!');
        }
    }
}


/***
 * 
 * We need to check the behavior of deepstream login system
 * 
 * otherwise !! 
 * 
 * There is different methods about how to get the state of hte connection! Listen and react to the connection state change and so on
 */