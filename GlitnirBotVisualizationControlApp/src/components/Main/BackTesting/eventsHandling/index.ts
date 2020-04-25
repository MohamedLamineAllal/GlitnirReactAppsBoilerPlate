import { onProcessProcessingFinished } from './handlers';
import { ipcClient } from '../../../../services/ipcClients/glitnirTradingSystem';
import config from './../../../../config';
import { BackTestingProcessFinishedResponse } from '../../../../types/ipc';
import { useStores } from '../../../../stores';

const stores = useStores();
// const backTestingDomainStore = stores.backTestingStore.domain;


//_________________________________________back testing processing finished response

ipcClient.on(
    config.ipc.ipcEvents.backTestingEngine.BACK_TESTING_PROCESS_FINISH_RESPONSE,
    (response: BackTestingProcessFinishedResponse) => {
        onProcessProcessingFinished(response, stores);
    }
);