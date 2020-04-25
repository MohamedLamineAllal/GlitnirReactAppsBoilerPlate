import { BackTestingStore } from '../BackTestingStore';
import { TradingViewStore } from '../TradingViewStore';
import { observable, action, computed } from 'mobx';
import { Users, Processes, UsersProcesses, User } from './types';
import { RootStoreRef } from '../RootStoreRef';

export class UiStore extends RootStoreRef{

}

export class DomainStore extends RootStoreRef {
    @observable connectedUser?: User;
    @observable public users: Users = {};
    @computed public get usersCount() {
        return Object.keys(this.users).length;
    }

    @observable public processes: Processes = {};
    @computed public get processesCount() {
        return Object.keys(this.processes).length;
    }

    @observable public usersProcesses: UsersProcesses = {}; 
}

export class RootStore {
    public ui: UiStore;
    public domain: DomainStore;
    public backTestingStore: BackTestingStore;
    public tradingViewStore: TradingViewStore;

    constructor() {
        this.ui = new UiStore(this);
        this.domain = new DomainStore(this);
        this.backTestingStore = new BackTestingStore(this);
        this.tradingViewStore = new TradingViewStore(this);
    }
}



/**
 * users
 * Processes
 * ...etc 
 * and many other data are all stored on the root store as a global place!
 * 
 * Also there cells acts too as a cache! So when the process is gotten and stored next time it will not!
 * 
 * [TODO]
 * We need to manage the cache! At a certain size! We remove part of the elements that are not in use! (to think about later !!!!!!)
 * 
 */