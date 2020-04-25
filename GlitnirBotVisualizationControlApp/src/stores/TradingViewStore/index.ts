import { observable, action, computed } from 'mobx';
import { RootStore } from '../RootStore';
import { Process, User } from '../RootStore/types';
import { RootStoreRef } from '../RootStoreRef';
import { FetchProcessState, FetchProcessType } from '../types';

export class UiStore extends RootStoreRef{
    
}

export class DomainStore extends RootStoreRef{
    //_________________________________________users

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
                    id => this.rootStore.domain.processes[id]
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
                for (let processId of processesIds) {
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
                const payload = processesIds.filter(id => !this.rootStore.domain.processes[id]);
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
}

export class TradingViewStore extends RootStoreRef {
    public ui: UiStore;
    public domain: DomainStore;
        
    constructor(rootStore: RootStore) {
        super(rootStore);
        this.ui = new UiStore(rootStore);
        this.domain = new DomainStore(rootStore);
    }
}