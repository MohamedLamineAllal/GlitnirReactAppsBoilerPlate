import React, { useRef, useEffect, Ref, RefObject, useState } from 'react';
import {
    createChart,
    IChartApi,
    DeepPartial,
    ChartOptions,
    ISeriesApi,
    BarData,
    HistogramData,
    LineData,
    Time,
    SeriesDataItemTypeMap,
    SeriesMarker,
    MouseEventParams,
    IPriceLine
} from 'lightweight-charts';
import styled from 'styled-components';
import { IDataVisualizationBoxProps, IDataVisualizationBox } from '../../../DataVisualization/interface';
import { SetStateCallback } from '../../../../customHooks/useStateWithGet';
import { ExchangeName, string_symbol, string_interval } from '../../../../types/trading';
import { FirstSigNoDoubleSignal, CloseSigNoDoubleSignal, MainSignal } from './types';

export enum LineStyle {
    Solid = 0,
    Dotted = 1,
    Dashed = 2,
    LargeDashed = 3,
    SparseDotted = 4
}
// ______________________________________ chart

export interface IChartCandle {
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


export interface IFeedData {
    tickCandles: IChartCandle[],
    firstSigNoDoubleSignals: FirstSigNoDoubleSignal[],
    closeSigNoDoubleSignals: CloseSigNoDoubleSignal[],
    mainSignals: MainSignal[]
}

export interface TradingChartTheme {
    container: {
        style: string
    },
    chartContainer: {
        style: string
    }
}


const Container = styled.div`

`;

const ChartContainer = styled.div`
`;

const defaultChartOptions = {
    candles: {

    }
}

const DEFAULT_MARKER = {
    color: 'blue',
    shape: "circle",
    position: "aboveBar"
} as SeriesMarker<Time>;


// _____________________________________  data modifier

export type SerieType = "Bar" | "Candlestick" | "Area" | "Line" | "Histogram";

// TODO: move that to a more suited place
export type UpdateCandleCallback = (candle: IChartCandle) => void;
export type UpdateManyCandlesCallback = (candle: IChartCandle[]) => void;
export type setCandlesCallback = (candles: IChartCandle[]) => void;
export type SerieUpdateModifierCallback<DataType> = (data: DataType) => void;
export type SerieUpdateManyModifierCallback<DataType> = (data: DataType[]) => void;
export type SerieSetModifierCallback<DataType> = (data: DataType[]) => void;

export type UpdateFeedsMarkersCallback<
    ModifierDataType extends SeriesDataItemTypeMap[ISerieAPIType]  & { mark?: boolean | SeriesMarker<Time>} = any,
    ISerieAPIType extends SerieType = any
> = (feedData: ModifierDataType[], update?: boolean) => void

// _________________________________ setMarker

interface ChartSeriesRef {
    tickCandles: ISeriesApi<"Candlestick">
}




// _________________________________ markers defaults properties
type SignalName = 'firstSigNoDoubleSignals' |
'closeSigNoDoubleSignals' |
'mainSignals';

type MarkersPropsObject = {
    [markerName in SignalName]: Omit<SeriesMarker<Time>, 'time'>
}

const MARKERS_DEFAULT: MarkersPropsObject = {
    firstSigNoDoubleSignals: {
        color: 'blue',
        position: "aboveBar",
        shape: 'circle'
    },
    closeSigNoDoubleSignals: {
        color: 'orange',
        position: "aboveBar",
        shape: 'circle'
    },
    mainSignals: {
        color: 'red',
        position: "aboveBar",
        shape: 'square'
    }
}


// ____________________________ component and props

interface TradingChartProps extends IDataVisualizationBoxProps<IFeedData> {
    className?: string,
    // candles: Candle[],
    theme?: TradingChartTheme,
    chartOptions?: DeepPartial<ChartOptions>,
    defaultChartOptionsName?: keyof typeof defaultChartOptions,
}


export const KidoLightChart = ({
    getFeeder,
    className,
    theme,
    chartOptions = {},
    defaultChartOptionsName = 'candles'
}: TradingChartProps) => {
    const [firstSigNoDoubleSignals, setFirstSigNoDoubleSignals] = useState<SeriesMarker<Time>[]>([]);
    const [closeSigNoDoubleSignals, setCloseSigNoDoubleSignals] = useState<SeriesMarker<Time>[]>([]);
    const [mainSignals, setMainSignals] = useState<SeriesMarker<Time>[]>([]);
    const chartRef = useRef<IChartApi>();
    const chartContainerRef = useRef<any>();
    const seriesRef = useRef<ChartSeriesRef>({} as ChartSeriesRef);
    const lastFirstSigNoDoubleSignalsRef = useRef<SeriesMarker<Time>[]>();
    const lastCloseSigNoDoubleSignalsRef = useRef<SeriesMarker<Time>[]>();
    const lastMainSignalsRef = useRef<SeriesMarker<Time>[]>();

    // const candleSticksSeriesRef = useRef<ISeriesApi<"Candlestick"> | undefined>();

    useEffect(() => {
        // _________________________________________ component mounted

        // _______________________________ create chart
        chartRef.current = createChart(chartContainerRef.current, {
            ...defaultChartOptions[defaultChartOptionsName],
            ...chartOptions,
        });
        // ________________ passing update method
        if (getFeeder) {
            getFeeder({
                update: createUpdateModifier(
                    seriesRef,
                    updateFeedMarkers as any,
                    maxIndicatorValueRef
                ) as any,
                updateMany: createUpdateManyModifier(
                    seriesRef,
                    updateFeedMarkers as any,
                    maxIndicatorValueRef
                ) as any,
                set: createSetModifier(
                    seriesRef,
                    updateFeedMarkers as any,
                    maxIndicatorValueRef
                ),
                setMany: createSetModifier(
                    seriesRef,
                    updateFeedMarkers as any,
                    maxIndicatorValueRef
                ) as any
            });
        }

        // _______________________________________________ component unmounted
        return () => {
            // _______________________________________clean up
        };
    }, []);

    // _________________________ setting the markers
    if (
        seriesRef.current &&
        seriesRef.current.tickCandles
    ) {
        if (
            lastFirstSigNoDoubleSignalsRef.current === firstSigNoDoubleSignals
        ) {
            seriesRef.current.tickCandles.setMarkers(firstSigNoDoubleSignals);
        }

        if (lastCloseSigNoDoubleSignalsRef.current === closeSigNoDoubleSignals) {
            seriesRef.current.tickCandles.setMarkers(closeSigNoDoubleSignals);
        }

        if (lastMainSignalsRef.current === mainSignals ) {
            seriesRef.current.tickCandles.setMarkers(mainSignals);
        }
    }

    // TODO: add theme styles
    return <Container className={className}>
        <ChartContainer ref={chartContainerRef}/>
    </Container>
}


// _________________________________ create component hook

export interface CreateComponentData {
    options: {
        className?: string,
        // candles: Candle[],
        theme?: TradingChartTheme,
        chartOptions?: DeepPartial<ChartOptions>,
        defaultChartOptionsName?: keyof typeof defaultChartOptions,
    }
}

export function createComponent({
    options = {}
}: CreateComponentData): IDataVisualizationBox {
    console.log("GETTING WHALES CHART CUSTOM COMPONENT !!!!!!!")
    return ({
        getFeeder
    }: IDataVisualizationBoxProps<IFeedData>) => {
        return <KidoLightChart  // TODO: later the chart component will get more complicated We
        // we will handle all the variation and map from data
            getFeeder={(feeder) => {
                if (getFeeder) {
                    getFeeder(feeder);
                }
            }}
            chartOptions={options.chartOptions}
            theme={options.theme}
            defaultChartOptionsName={options.defaultChartOptionsName || 'candles'}
        />;
    }
}
