import { ExchangeName, string_symbol, string_interval, Candle, BuySellSignal, TrailingData, StatisticsData } from '../trading';


export interface GetDataParams {
    exchange: ExchangeName,
    symbol: string_symbol,
    interval: string_interval,
    userId?: number,
    processId?: number,
    runningAgentId?: number,
    startTime?: number,
    endTime?: number
}

export enum HistoricalDataType {
    Candles,
    BuySellSignals,
    TrailingData
}

export type GetMixHistoricalDataResponse = Partial<{
    candles: Candle[],
    buySellSignals: BuySellSignal[],
    trailingData: TrailingData[]
}>;

export interface MixHistoricalDataRequestObj extends GetDataParams {
    dataToRequest?: HistoricalDataType[]
}



//__________________________________________back testing engine
export enum BackTestingProcessingState {
    Success,
    Failed
}

export interface BackTestingProcessFinishedResponse {
    state: BackTestingProcessingState,
    processId?: number,
    startTime?: number,
    endTime?: number,
    realTime?: number, 
    statisticsData?: StatisticsData
}





//___________________________________ clientsCommunication broker
export type MultiQueryOneResponseState = 'success' | 'error';

export interface MultiQueryOneResponseObj {
    state: MultiQueryOneResponseState,
    response?: any,
    err?: any  
}