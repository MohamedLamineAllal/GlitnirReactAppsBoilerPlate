import { ipcClient } from "../../../../services/ipcClients/glitnirTradingSystem";
import { StoresContext } from "../../../../stores";
import config from "../../../../config";
import { BackTestingProcessFinishedResponse, BackTestingProcessingState } from "../../../../types/ipc";
import { StatisticsData } from "../../../../types/trading";

//_________________________________start back testing process
//_____________________________start
export async function startBackTesting(stores: StoresContext) {
    const backTestingDomainStore = stores.backTestingStore.domain;
    const processId = backTestingDomainStore.selectedProcessId;

    if (
        !backTestingDomainStore.listOfBackTestingProcessesOnProcess.includes(
            processId
        )
    ) {
        const response = await ipcClient.request({
            eventName: '',
            data: {
                processId, // user process id
                startTime: backTestingDomainStore.startDateTime.getTime(),
                endTime: backTestingDomainStore.endDateTime.getTime(),
                realTime: backTestingDomainStore.realTime
            },
            processId: config.ipc.backTestingEngineProcessId
        });

        if (response.state === 'onProcess') {
            backTestingDomainStore.listOfBackTestingProcessesOnProcess.push(processId);   
        } else {
            // manage failure or rejection !!!!!!
            /**
             * Error message !!!
             */
        }
    }
}

//_____________________________process finished and results
export async function onProcessProcessingFinished(response: BackTestingProcessFinishedResponse, stores: StoresContext) {
    if (response.state === BackTestingProcessingState.Success) {
        const backTestingDomainStore = stores.backTestingStore.domain;
        backTestingDomainStore.removeProcessFromBacktestingOnProcessList(response.processId as number);
        backTestingDomainStore.statisticData[response.processId as number] = response.statisticsData as StatisticsData;
    } else {
        /**
         * handle the failing and errors and problems
         */
    }
}


