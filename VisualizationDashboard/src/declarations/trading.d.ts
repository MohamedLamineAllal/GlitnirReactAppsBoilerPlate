export interface Candle {
    open: number;
    close: number;
    high: number;
    low: number;
    volume: number;
    openTime: number; // timestamp ms
    closeTime: number;
    trades: number;
    // ...
}

export type GoldScriptCandle = Candle & {
    buy: boolean,
    sell: boolean
}