import { RootStore } from "../RootStore";

export abstract class RootStoreRef {
    public rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }
}