import { ipcClient } from "../../../../../services/ipcClients/glitnirTradingSystem";
import config from "../../../../../config";
import { stores } from "../../../../../stores";
import { DomainStore } from "../../../../../stores/TradingViewStore";
import { Process } from "../../../../../stores/RootStore/types";

//_________________________________________start resume a process

const tradingViewDomainStore: DomainStore = stores.tradingViewStore.domain;

export async function startResumeAProcess(processId: number) {
    try {
        const response = await ipcClient.request({
            eventName: config.ipc.ipcEvents.botEngine.BOT_ENGINE_PROCESS_START,
            data: processId,
            processId: config.ipc.botEngineProcessId
        });
    
        if (response.state === 'success') {
            (tradingViewDomainStore.selectedProcess as Process).state = 'Running';
            return response;
        } else {
            return Promise.reject(response.err);
        }
    } catch(err) {
        return Promise.reject(err);
    }
}

export async function stopARunningProcess(processId: number) {
    try {
        const response = await ipcClient.request({
            eventName: config.ipc.ipcEvents.botEngine.BOT_ENGINE_PROCESS_STOP,
            data: processId,
            processId: config.ipc.botEngineProcessId
        });
    
        if (response.state === 'success') {
            (tradingViewDomainStore.selectedProcess as Process).state = 'Stopped';
            
            return response;
        } else {
            return Promise.reject(response.err);
        }
    } catch(err) {
        return Promise.reject(err);
    }
}

//_____________________________________________listen to real time feed
export async function onRealTimeFeed(data: any) {

}