import GoldScript from "../../../imported/goldScript";
import { Candle } from "../../../declarations/trading";

export interface GoldScriptBuySellSerie {
    buy: boolean[],
    sell: boolean[]
}

export interface GoldScriptBuySellPoint {
    buy: boolean,
    sell: boolean
}


export function calculateCandleIndicator(candles: Candle[], index: number, backOffset: number = 60): GoldScriptBuySellPoint {
    const goldScript = new GoldScript(
        candles.slice(index - backOffset, index + 1),
        backOffset
    );
    const { buy, sell } = goldScript.calculate();

    // console.log({
    //     buy,
    //     sell
    // });

    return { buy: buy[buy.length - 1], sell: sell[sell.length - 1] };
}

export function calculateAllCandles(candles: Candle[], backOffset: number): GoldScriptBuySellSerie {
    const result: GoldScriptBuySellSerie = { buy: [], sell: [] };
    let buySellPoint: GoldScriptBuySellPoint;  // to opitimise you may like to use array with enum (enum for readability) [to do]
    for (let i = backOffset; i < candles.length; i++) {
        buySellPoint = calculateCandleIndicator(candles, i, backOffset);
        result.buy.push(buySellPoint.buy);
        result.sell.push(buySellPoint.sell);
    }
    return result;
}