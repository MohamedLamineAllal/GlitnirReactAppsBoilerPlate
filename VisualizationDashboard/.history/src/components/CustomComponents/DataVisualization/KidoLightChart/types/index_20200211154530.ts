

export interface Trade {
    id: number,
    exchange?: ExchangeName,
    symbol?: string_symbol,
    price: number,
    quantity: number,
    buyerOrderId?: number,
    sellerOrderId?: number,
    tradeTime: number,
    isBuyerMaker: boolean, // TODO: at ExchangeAPI level
    isBestMatch: boolean,
    updated_at?: Date,
    created_at?: Date
}

export interface Candle {
    // _____________ trading tuple
    exchange?: ExchangeName,
    symbol?: string_symbol,
    interval?: string_interval,
    // _____________ time
    openTime: number; // timestamp ms
    closeTime: number; // Candle interval close time
    eventTime?: number; // taking snapshot event time
    time: number,
    // _____________ ohlc
    open: number;
    close: number;
    high: number;
    low: number;
    // _____________ volumes
    volume: number;
    buyVolume?: number;
    sellVolume?: number;
    avgBySizeVolume?: number;
    buyAvgBySizeVolume?: number;
    sellAvgBySizeVolume?: number;
    quoteVolume?: number;
    quoteAssetVolume?: number;
    baseAssetVolume?: number;
    quoteBuyVolume?: number;
    // ______________ trades
    trades: number; // number of total trades
    buyTrades?: number;
    sellTrades?: number;
    // ______________ pressure
    buyPressure?: number;
    sellPressure?: number;
    // ______________ is final (wether the snapshot is the one of the interval close)
    isFinal?: boolean;
    // _____________ extra
    firstTradeId?: number | string;
    lastTradeId?: number | string;
    // ...
}