export enum FetchProcessType {
    GetAll,
    GetProcessesOnly,
    None
}

export interface FetchProcessState {
    state: FetchProcessType,
    payload?: number[]
}