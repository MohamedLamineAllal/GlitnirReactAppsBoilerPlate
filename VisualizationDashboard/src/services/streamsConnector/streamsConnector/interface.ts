export interface StreamData<DataType=any> {
    dashboardId: string,
    boxId: string,
    data: DataType
}

export type OnDataCallback = (data: StreamData) => void;

export abstract class StreamConnector {
    public abstract onData(callback: OnDataCallback): StreamConnector;
    public abstract onStreamConnection(callback: () => void): StreamConnector;
}
