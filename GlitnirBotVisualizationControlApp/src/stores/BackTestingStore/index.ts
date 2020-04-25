import { observable, action, computed } from 'mobx';
import { RootStore } from '../RootStore';
import { StatisticsDataByProcess } from './types';
import { RootStoreRef } from '../RootStoreRef';
import { FetchProcessState, FetchProcessType } from '../types';

export class UiStore extends RootStoreRef {
    @observable public topControlBar = {
        startDateTime: {
            open: false
        },
        endDateTime: {
            open: false
        }
    }
}

export class DomainStore extends RootStoreRef {
    // _________________________________________ users

    @observable public selectedUserId: number = NaN;

    @computed public get usersList() {
        return Object.keys(this.rootStore.domain.users).map((userId: string) => this.rootStore.domain.users[userId]);
    }

    @computed public get selectedUser() {
        return this.rootStore.domain.users[this.selectedUserId];
    }

    // ________________________________________processes
    @observable public selectedProcessId: number  = NaN;

    @computed public get processesList() {
        if (
            this.selectedUserId
        ) {
            const processesIds = this.rootStore.domain.usersProcesses[this.selectedUserId];

            if (Array.isArray(processesIds) && processesIds.length > 0) {
                return processesIds.map(
                    (id) => this.rootStore.domain.processes[id]
                );
                // return [
                //     ...this.selectedProcessId ? [this.selectedProcessId]: [],
                //     ...processesIds.filter(id => id !== this.selectedProcessId)
                // ].map(
                //     id => this.rootStore.domain.processes[id]
                // );
            }
        }

        return [];
    }

    @computed public get selectedProcess() {
        if (this.selectedProcessId) {
            return this.rootStore.domain.processes[this.selectedProcessId];
        }

        return undefined;
    }

    public needToFetchProcess() {
        if (
            this.selectedUserId
        ) {
            const processesIds = this.rootStore.domain.usersProcesses[this.selectedUserId];

            if (Array.isArray(processesIds) && processesIds.length > 0) {
                for (const processId of processesIds) {
                    if (!this.rootStore.domain.processes[processId]) {
                        return true
                    }
                }

                return false;
            } else {
                return true;
            }

        }

        return false;
    }

    public processesToFetch(): FetchProcessState {
        if (this.selectedUserId) {
            const processesIds = this.rootStore.domain.usersProcesses[this.selectedUserId];

            if (Array.isArray(processesIds) && processesIds.length > 0) {
                const payload = processesIds.filter((id) => !this.rootStore.domain.processes[id]);
                if (payload.length > 0) {
                    return {
                        state: FetchProcessType.GetProcessesOnly,
                        payload
                    };
                } else {
                    return {
                        state: FetchProcessType.None
                    }
                }
            } else {
                return {
                    state: FetchProcessType.GetAll
                }
            }
        }

        return {
            state: FetchProcessType.None
        };
    }


    // _________________________________________ real time or historical switch
    @observable public realTime: boolean = false;


    // _________________________________________  date time interval
    @observable public startDateTime: Date = new Date();
    @observable public endDateTime: Date = new Date();

    // _________________________________________ running backTesting
    @observable public listOfBackTestingProcessesOnProcess: number[] = [];

    @action public removeProcessFromBacktestingOnProcessList(processId: number) {
        this.listOfBackTestingProcessesOnProcess.splice(
            this.listOfBackTestingProcessesOnProcess.indexOf(processId),
            1
        );
    }

    // ______________________________ statistics

    @observable public statisticData: StatisticsDataByProcess = {};

    @computed public get processesStatisticsCount() {
        return Object.keys(this.statisticData).length;
    }
}

export class BackTestingStore extends RootStoreRef {
    public ui: UiStore;
    public domain: DomainStore;

    constructor(rootStore: RootStore) {
        super(rootStore);
        this.ui = new UiStore(rootStore);
        this.domain = new DomainStore(rootStore);
    }
}
