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
    SeriesMarker
} from 'lightweight-charts';
import styled from 'styled-components';
import { IDataVisualizationBoxProps, IDataVisualizationBox } from '../../../DataVisualization/interface';
import { CandleStickChart } from '../../../DataVisualization/CandleStickChart';


// ______________________________________ chart

export interface IChartCandle {
    id?: number,
    time: Time, // timestamp ms
    open: number;
    close: number;
    high: number;
    low: number;
    openTime?: number;
    closeTime?: number;
    volume?: number;
    quoteVolume?: number;
    quoteAssetVolume?: number;
    baseAssetVolume?: number;
    trades?: number;
    // _______ part specific to real time feed candle
    eventTime?: number,
    buyVolume?: number,
    quoteBuyVolume?: number,
    isFinal?: boolean,
    firstTradeId?: number | string,
    lastTradeId?: number | string
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
> = (feedData: ModifierDataType[]) => void

// _________________________________ setMarker
function getSetMarker<
    ModifierDataType extends SeriesDataItemTypeMap[ISerieAPIType]  & { mark?: boolean | SeriesMarker<Time>} = any,
    ISerieAPIType extends SerieType = any
>(
    markers: SeriesMarker<Time>[],
    setMarkers: (markers: SeriesMarker<Time>[]) => void
): UpdateFeedsMarkersCallback<ModifierDataType, ISerieAPIType> {
    return (feedData: ModifierDataType[]) => {
        // update the markers
        const newMarkers = feedData.reduce(
            (
                _newMarkers: SeriesMarker<Time>[],
                data
            ) => {
                if (data.mark) {
                    if (data.mark !== true) {
                        /**
                         * Custom marker
                         */
                        _newMarkers.push({
                            ...data.mark,
                            time: data.time
                        });
                    } else {
                        /**
                         * Default marker
                         */
                        _newMarkers.push({
                            ...DEFAULT_MARKER,
                            time: data.time
                        });
                    }
                }
                return _newMarkers;
            },
            []
        );

        if (newMarkers.length > 0) {
            setMarkers([
                ...markers,
                ...newMarkers
            ]);
        }
    }
}

// __________________________________ update
function createUpdateModifier<
    ModifierDataType extends SeriesDataItemTypeMap[ISerieAPIType]  & { mark?: boolean | SeriesMarker<Time>} = any,
    ISerieAPIType extends SerieType = any
>(
    ref: RefObject<ISeriesApi<ISerieAPIType> | undefined>,
    updateFeedMarkers: UpdateFeedsMarkersCallback<ModifierDataType, ISerieAPIType>
): SerieUpdateModifierCallback<ModifierDataType> {
    return (data: ModifierDataType) => {
        if (ref.current) {
            // update the serie
            ref.current.update(data);
            // update the markers
            updateFeedMarkers([data]);
        }
    }
}
function createUpdateManyModifier<
    ModifierDataType extends SeriesDataItemTypeMap[ISerieAPIType] = any & { mark?: boolean | SeriesMarker<Time>},
    ISerieAPIType extends SerieType = any
>(
    ref: RefObject<ISeriesApi<ISerieAPIType> | undefined>
): SerieUpdateManyModifierCallback<ModifierDataType> {
    return (data: ModifierDataType[]) => {
        if (ref.current) {
            for (const el of data) {
                ref.current.update(el); // TODO: check if updates happen only one by one
            }
        }
    }
}
// ___________________________________ set
function createSetModifier<
    ModifierDataType extends SeriesDataItemTypeMap[ISerieAPIType] = any & { mark?: boolean | SeriesMarker<Time>},
    ISerieAPIType extends SerieType = any
>(
    ref: RefObject<ISeriesApi<ISerieAPIType> | undefined>
): SerieSetModifierCallback<ModifierDataType> {
    return (data: ModifierDataType[]) => {
        if (ref.current) {
            ref.current.setData(data);
        }
    }
}


// ____________________________ component and props

interface TradingChartProps extends IDataVisualizationBoxProps<IChartCandle> {
    className?: string,
    // candles: Candle[],
    theme?: TradingChartTheme,
    chartOptions?: DeepPartial<ChartOptions>,
    defaultChartOptionsName?: keyof typeof defaultChartOptions,
}


export const WhalesChart = ({
    getFeeder,
    className,
    theme,
    chartOptions = {},
    defaultChartOptionsName = 'candles'
}: TradingChartProps) => {
    const [markers, setMarkers] = useState<SeriesMarker<Time>[]>([]);
    const chartRef = useRef<IChartApi>();
    const chartContainerRef = useRef<any>();
    const candleSticksSeriesRef = useRef<ISeriesApi<"Candlestick"> | undefined>();
    const whalesValueLineSeriesRef = useRef<ISeriesApi<"Line"> | undefined>();
    // const candleSticksSeriesRef = useRef<ISeriesApi<"Candlestick"> | undefined>();

    useEffect(() => {
        // _________________________________________ component mounted

        // _______________________________ create chart
        chartRef.current = createChart(chartContainerRef.current, {
            ...defaultChartOptions[defaultChartOptionsName],
            ...chartOptions
        });

        // ___________ candles sticks series
        candleSticksSeriesRef.current = chartRef.current.addCandlestickSeries({
            // TODO: options go here
        });

        // ___________ line serie
        whalesValueLineSeriesRef.current = chartRef.current.addLineSeries({
            // TODO: options go here
        });

        // TODO: children => composition! line series ...etc

        // ________________ passing update method
        if (getFeeder) {
            getFeeder({
                update: createUpdateModifier<IChartCandle, 'Candlestick'>(candleSticksSeriesRef),
                updateMany: createUpdateManyModifier<IChartCandle, 'Candlestick'>(candleSticksSeriesRef),
                set: (candle) => {
                    if (candleSticksSeriesRef.current) {
                        candleSticksSeriesRef.current.setData([candle])
                    }
                },
                setMany: createSetModifier<IChartCandle, 'Candlestick'>(candleSticksSeriesRef)
            });
        }

        // _______________________________________________ component unmounted
        return () => {
            // _______________________________________clean up
        };
    }, []);

    // _________________________ setting the markers
    if (candleSticksSeriesRef.current) {
        candleSticksSeriesRef.current.setMarkers(markers);
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
    return ({
        getFeeder
    }: IDataVisualizationBoxProps<IChartCandle>) => {
        return <WhalesChart  // TODO: later the chart component will get more complicated We
        // we will handle all the variation and map from data
            getFeeder={(feeder) => {
                if (getFeeder) {
                    getFeeder(feeder);
                }
            }}
            chartOptions={options.chartOptions}
            theme={options.theme}
            defaultChartOptionsName={options.defaultChartOptionsName || 'candles'}
        />
    }
}
