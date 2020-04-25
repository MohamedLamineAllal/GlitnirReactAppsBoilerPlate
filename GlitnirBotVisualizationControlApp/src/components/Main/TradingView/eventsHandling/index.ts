import { ipcClient } from "../../../../services/ipcClients/glitnirTradingSystem";
import config from '../../../../config';
import { onRealTimeFeed } from "./handlers";

export function subscribeIPCClientListeners() {
    // _________________________________ real time data feed
    ipcClient.on(
        config.ipc.ipcEvents.botEngine.REAL_TIME_CANDLES_FEED,
        onRealTimeFeed
    );
}

export function unsubscribeIPCClientListeners() {
    // _________________________________ real time data feed
    ipcClient.removeListener(
        config.ipc.ipcEvents.botEngine.REAL_TIME_CANDLES_FEED,
        onRealTimeFeed
    );
}