import { string_symbol as string_symbol_ } from './symbols';

export type string_sellorbuy = 'BUY' | 'SELL';
export type string_timeInForce = "FOK" | "GTC" | "IOC";
export type string_orderType =
                        'LIMIT'
                        |'MARKET'
                        |'STOP_LOSS'
                        |'STOP_LOSS_LIMIT'
                        |'TAKE_PROFIT'
                        |'TAKE_PROFIT_LIMIT'
                        |'LIMIT_MAKER';
export type ExchangeName = 'Binance' | 'Bitmex';
export type string_symbol = string_symbol_;
export type string_interval =
                            '1m'
                            |'3m'
                            |'5m'
                            |'15m'
                            |'30m'
                            |'1h'
                            |'2h'
                            |'4h'
                            |'6h'
                            |'8h'
                            |'12h'
                            |'1d'
                            |'3d'
                            |'1w'
                            |'1M';


export interface Candle {
    openTime: number; // timestamp ms
    closeTime: number;
    open: number;
    close: number;
    high: number;
    low: number;
    volume: number;
    quoteVolume: number;
    quoteAssetVolume: number;
    baseAssetVolume: number;
    trades: number;
    // _______ part specific to real time feed candle
    eventTime?: number,
    buyVolume?: number,
    quoteBuyVolume?: number,
    isFinal?: boolean,
    firstTradeId?: number | string,
    lastTradeId?: number | string
    // ...
}

export interface Trade {
    id: number,
    eventTime?: number,
    exchange: ExchangeName,
    symbol: string_symbol,
    price: number,
    quantity: number,
    buyerOrderId?: number,
    sellerOrderId?: number,
    tradeTime: number,
    isBuyerMaker: boolean,
    isBestMatch: boolean,
    // updated_at?: Date,
    // created_at?: Date
}

export interface AggregatedTrade {
    id: number;
    eventType?: string;
    eventTime?: number;
    exchange: ExchangeName;
    symbol: string_symbol;
    price: number;
    quantity: number;
    firstTradeId: number;
    lastTradeId: number;
    tradeTime: number;
    isBuyerMaker: boolean;
    isBestMatch: boolean;
}

export type GoldScriptCandle = Candle & {
    buy: boolean,
    sell: boolean
}




export interface BuySellSerie {
    buy: boolean[],
    sell: boolean[]
}

export interface BuySellPoint {
    buy: boolean,
    sell: boolean
}

export type TradingIntervalTimes = [number, number];


export interface TradingWorkerInfo {
    exchange: ExchangeName;
    symbol: string_symbol;
    interval: string_interval;
}


// ___________________________ buy sell signals
export enum BuySellEnum {
    BUY,
    SELL
}

export interface BuySellSignal {
    id?: number,
    userId: number,
    runningAgentId: number,
    time: number,
    type: 'BUY'|'SELL',
    updated_at?: Date,
    created_at?: Date
}




// _________________________________ trailing data
export interface TrailingData {
    id?: number,
    runningAgentId: number,
    time: number,
    openTime: number,
    closeTime: number,
    stopLoss: number,
    maxPrice: number,
    updated_at?: Date,
    created_at?: Date
}




// _______________________________ back testing statistics data
export enum CalculationType {
    CapitalInvest
}

export interface BuySellCandle {
    candle: Candle,
    buy: boolean,
    sell: boolean
}

interface SuccessiveOccurrenceInfo {
    candle: BuySellCandle,
    occurrence: number
}

export interface BuySellStatisticsCore {
    benefit: number;
    benefitPercentage: number;
    capital: number;
    lossesNumber: number;
    winsNumber: number;
    noWinNoLoss: number;
    minWin: number;
    maxWin: number;
    minLoss: number;
    maxLoss: number;
    minLossPercentage: number;
    maxLossPercentage: number;
    minWinPercentage: number;
    maxWinPercentage: number;
}

export interface BuySellAllStatistics {
    totalBuySell: number,
    initialCapital: number,
    doubleBuys: SuccessiveOccurrenceInfo[],
    doubleSells: SuccessiveOccurrenceInfo[],
    closeBasedStatistic: BuySellStatisticsCore,
    openBasedStatistic: BuySellStatisticsCore,
    meanOCBasedStatistic: BuySellStatisticsCore,
    meanHLBasedStatistic: BuySellStatisticsCore
}

export interface StatisticsData {

}



// __________________ TradingView
export interface TradingViewOneData {
    candle: Candle,
    buySell: BuySellPoint,
    trailingData: TrailingData
}

export enum StorageType {
    Buy,
    Sell,
    Trade
}

export interface WhalesCandle {
    exchange: ExchangeName,
    symbol: string_symbol,
    interval: string_interval,
    storageType: StorageType,
    whalesValue: number,
    openTime: number,
    closeTime: number,
    high: number,
    low: number
    open: number,
    close: number,
    volume: number
}
