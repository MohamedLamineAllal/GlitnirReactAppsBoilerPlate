/**
 * Some style guidline
 * ======================
 * [s]- any variable starting with s like s_price this._s_haclose mean it's a serie (an array) [expected as a buffer for back values access !]
 * [_] any class member starting with _ mean it's a private member (not sure if it's forced by typescript!)
 */
// import { PSAR } from 'technicalindicators';
import { s_avg, s_lowest, s_highest, offset, s_sma, s_stdev, s_ema, Ema, s_rma, rma, s_tr, s_operate, s_add, s_substr, s_cross, s_minLength, s_change, s_max, s_min, s_stoch, stoch, s_op, s_rsi, s_cum, Cum, s_wma, wma, Sum, dev, s_dev, s_fixnan, s_cleanFirstNaNs, rising, falling, s_psar } from '../technical-analitics';


export type CandlesBuffersProperties = 'high' | 'low' | 'open' | 'close' | 'volume';

export interface GoldScriptCandleData {
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number
}

export interface Candle {
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number
}

export interface CandlesBuffers {
    open: number[],
    high: number[],
    low: number[],
    close: number[],
    volume: number[]
}

// export interface SARConfig {
//     step: number,
//     max: number,
//     start?: number
// }

class GoldScript {
    // important series variables
    private _CandlesBuffers: CandlesBuffers;
    private _BUFFER_SIZE_LIMIT: number;
    private _s_haopen!: number[];
    private _s_haclose!: number[];

    // result final indicator series
    // private _s_ind_buySignal: number[];
    // private _s_ind_sellSignal: number[];
    private _s_ind_oscHelper: number[] = [];
    private _s_ind_buy: boolean[] = [];
    private _s_ind_sell: boolean[] = [];


    // private _SAR_CONFIG: SARConfig;
    // Ichimoku constants
    private _ICHIMOKU_CONVERSION_PERIODS: number = 9;
    private _ICHIMOKU_BASE_PERIODS: number = 26;
    private _ICHIMOKU_LAGGING_SPAN_2_PERIODS: number = 52;
    private _ICHIMOKU_DISPLACEMENT: number = 26;

    // KBC constants
    private _KBC_TREND: number = 5;
    private _KBC_LENGTH: number = 20;
    private _KBC_MULT: number = 2.0;

    // PSAR constants
    private _PSAR_START: number = .02;
    private _PSAR_INCREMENT: number = .02;
    private _PSAR_MAXIMUM: number = .2;

    // RSI constants
    private _RSI_SMOOTHK = 3;
    private _RSI_SMOOTHD = 3;
    private _RSI_LENGTHRSI = 14;
    private _RSI_LENGTHSTOCH = 14;

    // KDJ constants

    private _KDJ_ILONG = 9;
    private _KDJ_ISIG = 3;


    // MACD constants
    private _MACD_FAST_LENGTH = 9;
    private _MACD_SLOW_LENGTH = 26;
    private _MACD_SIGNAL_LENGTH = 12;

    // pivots constants
    private _PIVOTS_N1: number = 12;
    private _PIVOTS_C: number = 5;
    private _PIVOTS_LEN2: number = 1;
    private _PIVOTS_LEN5: number = 2;

    // SLOW RSI constants
    private _SLOWRSI_PERIODS: number = 6;
    private _SLOWRSI_SMOOTH: number = 14;


    // private _currentCandle: CandleData | null; // use that for caching for better performance (test and see) [to do]

    constructor(
        candleBuffer: CandlesBuffers | Candle[], // buffer of candles (the last candle, is the current, the other are prev)
        BUFFER_SIZE_LIMIT: number,
        // SAR_CONFIG: SARConfig,
        ICHIMOKU_CONVERSION_PERIODS: number = 9, // optional params or an object [to do]
        ICHIMOKU_BASE_PERIODS: number = 26,
        ICHIMOKU_LAGGING_SPAN_2_PERIODS: number = 52,
        ICHIMOKU_DISPLACEMENT: number = 26,
        KBC_TREND: number = 5,
        KBC_LENGTH: number = 20,
        KBC_MULT: number = 2.0,
        PSAR_START: number = .02,
        PSAR_INCREMENT: number = .02,
        PSAR_MAXIMUM: number = .2,
        RSI_SMOOTHK: number = 3,
        RSI_SMOOTHD: number = 3,
        RSI_LENGTHRSI: number = 14,
        RSI_LENGTHSTOCH: number = 14,
        KDJ_ILONG: number = 9,
        KDJ_ISIG: number = 3,
        MACD_FAST_LENGTH: number = 9,
        MACD_SLOW_LENGTH: number = 26,
        MACD_SIGNAL_LENGTH: number = 12,
        PIVOTS_N1: number = 12,
        PIVOTS_C: number = 5,
        PIVOTS_LEN2: number = 1,
        PIVOTS_LEN5: number = 2,
        SLOWRSI_PERIODS: number = 6,
        SLOWRSI_SMOOTH: number = 14,
    ) {
        this._CandlesBuffers = this.candleBuffer(candleBuffer);
        this._BUFFER_SIZE_LIMIT = BUFFER_SIZE_LIMIT ? BUFFER_SIZE_LIMIT : 400;
        // constant config
        // this._SAR_CONFIG = SAR_CONFIG;
        this._ICHIMOKU_CONVERSION_PERIODS = ICHIMOKU_CONVERSION_PERIODS;
        this._ICHIMOKU_BASE_PERIODS = ICHIMOKU_BASE_PERIODS;
        this._ICHIMOKU_LAGGING_SPAN_2_PERIODS = ICHIMOKU_LAGGING_SPAN_2_PERIODS;
        this._ICHIMOKU_DISPLACEMENT = ICHIMOKU_DISPLACEMENT;
        this._KBC_TREND = KBC_TREND;
        this._KBC_LENGTH = KBC_LENGTH;
        this._KBC_MULT = KBC_MULT;
        this._PSAR_START = PSAR_START;
        this._PSAR_INCREMENT = PSAR_INCREMENT;
        this._PSAR_MAXIMUM = PSAR_MAXIMUM;
        this._RSI_SMOOTHK = RSI_SMOOTHK;
        this._RSI_SMOOTHD = RSI_SMOOTHD;
        this._RSI_LENGTHRSI = RSI_LENGTHRSI;
        this._RSI_LENGTHSTOCH = RSI_LENGTHSTOCH;
        this._KDJ_ILONG = KDJ_ILONG;
        this._KDJ_ISIG = KDJ_ISIG;
        this._MACD_FAST_LENGTH = MACD_FAST_LENGTH;
        this._MACD_SLOW_LENGTH = MACD_SLOW_LENGTH;
        this._MACD_SIGNAL_LENGTH = MACD_SIGNAL_LENGTH;
        this._PIVOTS_N1 = PIVOTS_N1;
        this._PIVOTS_C = PIVOTS_C;
        this._PIVOTS_LEN2 = PIVOTS_LEN2;
        this._PIVOTS_LEN5 = PIVOTS_LEN5;
        this._SLOWRSI_PERIODS = SLOWRSI_PERIODS;
        this._SLOWRSI_SMOOTH = SLOWRSI_SMOOTH;

        this.initHa();
    }

    /**
     * convert candles to CandlesBuffers
     * @param candles 
     */
    private candleBuffer(candles: Candle[] | CandlesBuffers) {
        if (Array.isArray(candles)) {
            return { // optimize by changing that to an array and use enum to access it in an convinient way! [to do]
                open: candles.map(candle => candle.open),
                close: candles.map(candle => candle.close),
                high: candles.map(candle => candle.high),
                low: candles.map(candle => candle.low),
                volume: candles.map(candle => candle.volume)
            }
        } else {
            /**
             * it's a CandlesBuffers
             */
            return candles;
        }
    }

    public getCandlesBuffersLength() {
        return this._CandlesBuffers.close.length;
    }

    static haclose(open: number, high: number, low: number, close: number): number {
        return (open + high + low + close) / 4;
    }

    public initHaclose(): GoldScript {
        if (!this._s_haclose) {
            this._s_haclose = new Array(this.getCandlesBuffersLength());
        }

        for (let i = 0; i < this.getCandlesBuffersLength(); i++) {
            this._s_haclose[i] = GoldScript.haclose(
                this._CandlesBuffers.open[i],
                this._CandlesBuffers.high[i],
                this._CandlesBuffers.low[i],
                this._CandlesBuffers.close[i]
            );
        }

        return this;
    }

    public initHaopen(): GoldScript {
        if (!this._s_haopen) {
            this._s_haopen = new Array(this.getCandlesBuffersLength());
        }

        this._s_haopen[0] = (this._CandlesBuffers.open[0] + this._CandlesBuffers.close[0]) / 2;

        for (let i = 1; i < this.getCandlesBuffersLength(); i++) {
            this._s_haopen[i] = (this._s_haopen[i - 1] + this._s_haclose[i - 1]) / 2;
        }

        return this;
    }

    public initHa(): GoldScript {
        return this.initHaclose().initHaopen();
    }



    // private validateCandlesBufferss(candleBuffer: CandlesBuffers) {
    //     const properties = Object.keys(candleBuffer);
    //     const valideProperties: CandlesBuffersProperties[]  = ['open', 'close', 'high', 'low'];

    //     // all properties there
    //     for (let prop of valideProperties) {
    //         if (!properties.includes(prop)) {
    //             return false;
    //         }
    //     }

    //     // all properties of same length
    //     for (let i = 0; i < valideProperties.length - 1; i++) {
    //         if (candleBuffer[valideProperties[i]].length !== candleBuffer[valideProperties[i+1]].length) {
    //             return false
    //         }
    //     }

    //     return true;
    // }

    /**
     *a method that allow us to backword access a serie

     s stand for serie

     if back isn't presented, we will return the last element of serie array (which mean the information of the current candle) ! Otherwise we will access the one of 'back' times before
      *
     * @param {any[]} serie
     * @param {number} [back]
     * @memberof GoldScript
     */
    s(serie: any[], back: number = 0): number {
        // decide if you implement exception throwing and no availability case (for performance seem better not)[to do]
        return serie[serie.length - 1 - back];
    }

    calculate(): { buy: boolean[], sell: boolean[] } {
        const s = this.s;
        const cbf = this._CandlesBuffers;

        // HA ________________________________________________________________//

        // -----------------------------------------------------the bellow variables aren't used any where! (no other occurence in the original scriopt ) [to see]  [NOT USED]
        // const hahigh: number = Math.max(s(cbf.high), Math.max(s(this._s_haopen), s(this._s_haclose)));
        // const halow: number = Math.min(s(cbf.low), Math.min(s(this._s_haopen), s(this._s_haclose)));
        //----------------------------------------------------------------------- END

        const s_price = this._s_haclose; // know that the price = haclose (as a serie here) and never changed [<-IMPORTANT INFO]. it will be used in different place later as it is. And also it's used in some methods that need back values !!!!! [IMPORTANT]
        const s_src = this._s_haclose; // same apply as above (price). a serie (needed for back access), and not changed at any place
        const s_c = this._s_haclose; // same apply as above (price, src). a serie (needed for back access), and not changed at any place


        // Ichimoku ________________________________________________________//
        //------------------------ALL THIS BLOCK DO NOTHING !!!!!!!!-----------------!!!!!!!--------[NOT USED]
        // const s_conversionLine = this.donchian(this._ICHIMOKU_CONVERSION_PERIODS);
        // const s_baseLine = this.donchian(this._ICHIMOKU_BASE_PERIODS);
        // const s_leadLine1 = offset(s_avg(s_conversionLine, s_baseLine), this._ICHIMOKU_DISPLACEMENT);
        // const s_leadLine2 = offset(this.donchian(this._ICHIMOKU_LAGGING_SPAN_2_PERIODS), this._ICHIMOKU_DISPLACEMENT);
        //------------------------ !!!!!!!!-----------------!!!!!!!-------- !!!!!!!!!!!!! END

        //KBC Inputs __________________________________________________________________//
        const s_basis = s_sma(s_src, this._KBC_LENGTH);
        const s_dev = s_stdev(s_src, this._KBC_LENGTH);
        // const s_ma = s_ema(s_src, this._KBC_LENGTH); // [NOT USED]
        const s_upper = s_basis.map((base, i) => base + s_dev[i]);
        const s_lower = s_basis.map((base, i) => base - s_dev[i]);
        // const s_MA5 = s_ema(s_src, this._KBC_LENGTH);
        // const s_range = s_tr(cbf.high, cbf.low, cbf.close);
        // const s_rangema = s_ema(s_range, this._KBC_LENGTH);
        // const upperkelt: number[] = s_add(s_MA5, s_rangema);
        // const lowerkelt: number[] = s_substr(s_MA5, s_rangema);

        //Parablic SAR ___________________________________________________________________//
        // const s_out2: number[] = PSAR.calculate({ high: cbf.high, low: cbf.low, step: this._PSAR_INCREMENT, max: this._PSAR_MAXIMUM }); // start is set to step (by default .02) [IMPORTANT]
        // const s_out2: number[] = s_psar(cbf.high, cbf.low, this._PSAR_START, this._PSAR_INCREMENT, this._PSAR_MAXIMUM); // start is set to step (by default .02) [IMPORTANT]
        // const s_hacloseOutCross: number[] = s_cross(this._s_haclose, s_out2);
        // const BEARISH: number[] = s_operate(
        //     [s_hacloseOutCross, this._s_haclose],
        //     ([hacoc, hac], access) => {
        //         return hacoc === 1 && access(1, 1) > hac;
        //     }
        // );
        // const BULLISH: number[] = s_operate(
        //     [s_hacloseOutCross, this._s_haclose],
        //     ([hacoc, hac], access) => {
        //         return hacoc === 1 && access(1, 1) < hac;
        //     }
        // );
        const s_bbr: number[] = s_operate(
            [s_src, s_lower, s_upper],
            ([src, lower, upper]) => (src - lower) / (upper - lower)
        );

        //SRSI_____________________________________________________________________//
        // const s_srcChange: number[] = s_change(s_src);
        // const s_up1: number[] = s_rma(s_max([s_srcChange], [0]), 9); // optimize s_operate [to do]

        // const s_down1: number[] = (() => {
        //     let lastRma: number | undefined = undefined;
        //     return s_srcChange.reduce((result: number[], srcChg: number) => {
        //         lastRma = rma(lastRma, -Math.min(srcChg, 0), 9);
        //         result.push(
        //             lastRma
        //         );
        //         return result;
        //     }, []);
        // })();

        // const rsi: number = // calculate the hole serie  [to do]
        //     s(s_down1) === 0 ? 100 :
        //         s(s_up1) === 0 ? 0 :
        //             100 - (100 / (1 + s(s_up1) / s(s_down1)));

        // const s_K: number[] = s_sma(s_stoch(s_c, cbf.high, cbf.low, 7), 5);
        // const s_D: number[] = s_sma(s_K, 3);
        // const s_rsi1: number[] = s_rsi(s_src, this._RSI_LENGTHRSI);
        // const s_k: number[] = s_ema(s_stoch(s_rsi1, s_rsi1, s_rsi1, this._RSI_LENGTHSTOCH), this._RSI_SMOOTHK);
        // const s_d: number[] = s_ema(s_k, this._RSI_SMOOTHD);

        //KDJ  _____________________________________________________________________________//
        const s_h: number[] = s_highest(cbf.high, this._KDJ_ILONG);
        const s_l: number[] = s_lowest(cbf.low, this._KDJ_ILONG);
        const s_RSV: number[] = s_op(
            [s_c, s_l, s_h],
            0,
            ([c, l, h]) => 100 * ((c - l) / (h - l))
        );
        const s_pK: number[] = this.bcwsma(s_RSV, this._KDJ_ISIG, 1);
        const s_pD: number[] = this.bcwsma(s_pK, this._KDJ_ISIG, 1);
        // const s_pJ: number[] = s_op(
        //     [s_pK, s_pD],
        //     0,
        //     ([pK, pD]) => 3 * pK - 2 * pD
        // );
        // const s_kD: number[] = s_avg(s_pK, s_pD);

        //MACD ____________________________________________________________________________//
        // const s_obv = s_cum(
        //     s_op(
        //         [s_src], 1,
        //         ([src], back, minLength, prevVal, passedData, passData, access) => {
        //             const prevSrc: number = access(0, 1);
        //             const vl: number = cbf.volume.length;
        //             const change: number = src - prevSrc;
        //             const volume = cbf.volume[vl - back - 1];

        //             return change > 0 ? volume : change < 0 ? -volume : 0;
        //         }
        //     )
        // );
        // const s_fast_ma = s_ema(s_src, this._MACD_FAST_LENGTH);
        // const s_slow_ma = s_ema(s_src, this._MACD_SLOW_LENGTH);
        // const s_macd = s_op([s_fast_ma, s_slow_ma], 0, ([f, s]) => f - s);
        // const s_signal = s_ema(s_macd, this._MACD_SIGNAL_LENGTH);
        // const s_hist = s_substr(s_macd, s_signal);

        //Pivots_____________________________________________________________________//
        // const s_n2ma = s_op(
        //     [this._s_haclose],
        //     Math.round(this._PIVOTS_N1 / 2),
        //     (stepValues, back) => 2 * wma(this._s_haclose, Math.round(this._PIVOTS_N1 / 2), back)
        // );
        // const s_nma = s_wma(this._s_haclose, this._PIVOTS_N1);
        // const s_diff = s_substr(s_n2ma, s_nma);
        // const sqn = Math.round(Math.sqrt(this._PIVOTS_N1));
        // const s_n2ma6 = s_op(
        //     [this._s_haopen],
        //     Math.round(this._PIVOTS_C / 2),
        //     (stepValues, back) => 2 * wma(this._s_haopen, Math.round(this._PIVOTS_C / 2), back)
        // );
        // const s_nma6 = s_wma(this._s_haopen, this._PIVOTS_C);
        // const s_diff6 = s_substr(s_n2ma6, s_nma6);
        // const sqn6 = Math.round(Math.sqrt(this._PIVOTS_C));
        // const s_a1 = s_wma(s_diff6, sqn6);
        // const s_a = s_wma(s_diff, sqn);
        // const s_gains: number[] = <number[]>new Sum(
        //     s_op(
        //         [s_a1, s_a],
        //         this._PIVOTS_LEN2,
        //         ([a1, a], back) => a1 > a ? 1 : 0
        //     ),
        //     this._PIVOTS_LEN2
        // ).get();
        // const s_losses: number[] = <number[]>new Sum(
        //     s_op(
        //         [s_a1, s_a],
        //         this._PIVOTS_LEN2,
        //         ([a1, a], back) => a1 < a ? 1 : 0
        //     ),
        //     this._PIVOTS_LEN2
        // ).get();
        // const s_cmo: number[] = s_op(
        //     [s_gains, s_losses],
        //     0,
        //     ([gain, loss]) => 100 * (gain - loss) / (gain + loss)
        // );
        // const s_H: number[] = s_highest(cbf.high, this._PIVOTS_LEN5);
        // const s_h1: number[] = s_op(
        //     [s_H],
        //     this._PIVOTS_LEN5,
        //     ([H], back) => dev(s_H, this._PIVOTS_LEN5, back) ? NaN : H
        // );
        // const s_hpivot: number[] = s_fixnan(s_h1);
        // const s_L: number[] = s_lowest(cbf.low, this._PIVOTS_LEN5);
        // const s_l1: number[] =
        //     s_op(
        //         [s_L],
        //         this._PIVOTS_LEN5,
        //         ([L], back) => dev(s_L, this._PIVOTS_LEN5, back) ? NaN : L
        //     );
        // const s_lpivot: number[] = s_fixnan(s_l1);

        // const s_sup = s_op(  // calculate those and see why they are useful [to do] [they aren't used as they are for anything]
        //     [s_cmo, s_lpivot], // use rsi as serie s_rsi [to do]
        //     0,
        //     ([cmo, lpivot]) => rsi < 25 && cmo > 50 ? lpivot : NaN
        // );
        // const s_res = s_op(
        //     [s_cmo, s_hpivot],
        //     0,
        //     ([cmo, hpivot]) => rsi > 75 && cmo < -50 ? hpivot : NaN
        // );
        // const s_xup = s_op(
        //     [s_cleanFirstNaNs(s_sup), cbf.low],
        //     0,
        //     ([sup, low], back, minLength, prevXup) => sup !== NaN ? low : prevXup
        // );
        // const s_xdown = s_op(
        //     [s_cleanFirstNaNs(s_res), cbf.high],
        //     0,
        //     ([res, high], back, minLength, prevXdown) => res !== NaN ? high : prevXdown
        // );

        //Hi-Lo ____________________________________________________________________________//
        // const s_hGst = s_highest(cbf.high, 1);
        // const s_lWst = s_lowest(cbf.low, 1);

        //SLOW RSI _________________________________________________________________________//
        const s_r1 = s_ema(s_price, this._SLOWRSI_PERIODS);
        const s_r2 = s_op(
            [s_price, s_r1],
            0,
            ([price, r1]) => price > r1 ? price - r1 : 0
        );
        const s_r3 = s_op(
            [s_price, s_r1],
            0,
            ([price, r1]) => price < r1 ? r1 - price : 0
        );
        const s_r4 = this.calc_wima(s_r2, this._SLOWRSI_SMOOTH);
        const s_r5 = this.calc_wima(s_r3, this._SLOWRSI_SMOOTH);
        const s_rr = s_op(
            [s_r4, s_r5],
            0,
            ([r4, r5]) => r5 === 0 ? 100 : 100 - (100 / (1 + (r4 / r5)))
        );

        //GANN Trend __________________________________________________________________________//
        const s_avghigh: number[] = s_ema(cbf.high, 10);
        const s_avglow: number[] = s_ema(cbf.low, 10);
        const s_uptrend: boolean[] = s_op(
            [cbf.high, s_avghigh],
            0,
            ([high, avghigh]) => high > avghigh
        );
        const s_downtrend: boolean[] = s_op(
            [cbf.low, s_avglow],
            0,
            ([low, avglow]) => low < avglow
        );

        //__________________________________________Added Indicator 
        //BuySell _____________________________________________________________________//
        const s_buySignal = s_op(
            [s_pD, s_bbr, s_rr, s_uptrend],
            1,
            ([pD, bbr, rr, uptrend], back) => rising(s_pD, 1, back) && rising(s_bbr, 1, back) && rising(s_rr, 1, back) && uptrend
        );

        const s_sellSignal = s_op(
            [s_pD, s_bbr, s_rr, s_downtrend],
            1,
            ([pD, bbr, rr, downtrend], back) => falling(s_pD, 1, back) && falling(s_bbr, 1, back) && falling(s_rr, 1, back) && downtrend
        );
        
        /**
         * 
         * There is no sense to this shifting, either we calculate for all different indexes (serie calculation even for the buy signal and the rest, either no serie calculation, and it should be a direct indicator number)
         */

        this._s_ind_oscHelper = s_op(
            [s_buySignal, s_sellSignal],
            1,
            ([buySignal, sellSignal], back, minLength, prevVal) => buySignal ? 1 : sellSignal ? 0 : prevVal
        ); 

        this._s_ind_buy = s_op(
            [s_buySignal, this._s_ind_oscHelper],
            1,
            ([buySignal, oscHelper], back, minLength, prevVal, passedData, passData, access) => buySignal && access(1, 1) === 0 // oscHelper prev val
        );

        this._s_ind_sell = s_op(
            [s_sellSignal, this._s_ind_oscHelper],
            1,
            ([sellSignal, oscHelper], back, minLength, prevVal, passedData, passData, access) => sellSignal && access(1, 1) === 1 // oscHelper prev val
        );

        return {
            sell: this._s_ind_sell,
            buy: this._s_ind_buy
        };
    }


    /**
     * the function work with series
     *
     * @param {number} len
     * @returns {number[]}
     * @memberof GoldScript
     */
    donchian(len: number): number[] {
        return s_avg(s_lowest(this._CandlesBuffers.low, len), s_highest(this._CandlesBuffers.high, len));
    }



    //----------------------NOT USED METHODS !--------------------------------------
    heikUpColor(haclose: number, haopen: number): boolean {
        return haclose > haopen;
    }

    heikDownColor(haclose: number, haopen: number): boolean {
        return haclose <= haopen;
    }
    // ------------------------------------------------ NOT USED METHODS! END


    bcwsma(s: number[], l: number, m: number): number[] {
        return s_op(
            [s],
            0,
            (stepValues, back, minLength, prevBcwsma) =>
                (m * this.s(s, back) + (l - m) * (prevBcwsma || 0)) / l
        );
    }

    calc_wima(serie: number[], length: number): number[] {
        const s_MA_s = s_op(
            [serie],
            0,
            ([val], back, minLength, prevMa_s) =>
                (
                    val +
                    (prevMa_s ? prevMa_s * (length - 1) : 0)
                ) / length
        );
        return s_MA_s;
    }

    shiftPush(serie: any[], value: any, limit?: number): GoldScript {
        if (limit) {
            if (serie.length >= limit) {
                this._shiftPush(serie, value);
            } else {
                serie.push(value);
            }
        } else {
            this._shiftPush(serie, value);
        }
        return this;
    }

    private _shiftPush(serie: any[], value: any): void {
        serie.shift();
        serie.push(value);
    }

    limitSerie(serie: any[], sizeLimit: number): any[] { // use that for limiting the size of the series to only what's needed!! think about it for optimization if needed [to do]
        const length = serie.length;
        if (length > sizeLimit) {
            serie.splice(0, length - sizeLimit);
        }
        return serie;
    }

}

export default GoldScript;