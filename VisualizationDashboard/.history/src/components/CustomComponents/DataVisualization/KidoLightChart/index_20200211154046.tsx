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

export enum LineStyle {
    Solid = 0,
    Dotted = 1,
    Dashed = 2,
    LargeDashed = 3,
    SparseDotted = 4
}
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

export 

export interface IFeedData {
    candles: IChartCandle[],
    indicatorValues: IIndicatorValue[]
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
function getUpdateFeedsMarkers<
    ModifierDataType extends SeriesDataItemTypeMap[ISerieAPIType]  & { mark?: boolean | SeriesMarker<Time>} = any,
    ISerieAPIType extends SerieType = any
>(
    setMarkers: (state: SetStateCallback<SeriesMarker<Time>[]> | SeriesMarker<Time>[]) => void
): UpdateFeedsMarkersCallback<ModifierDataType, ISerieAPIType> {
    return (feedData: ModifierDataType[], update: boolean = true) => {
        console.log("Update markers :::::::::::::::::::");
        // update the markers
        const newMarkers = feedData.reduce(
            (
                _newMarkers: SeriesMarker<Time>[],
                data
            ) => {
                if (data.markerOptions) {
                    /**
                     * Custom marker
                     */
                    _newMarkers.push({
                        ...data.markerOptions,
                        time: data.time
                    });
                } else {
                    /**
                     * Default dynamic marker
                     */
                    _newMarkers.push({
                        ...DEFAULT_MARKER,
                        time: data.time
                    });
                }

                return _newMarkers;
            },
            []
        );

        console.log("new markers to add !!!!!!!!")
        console.log(newMarkers.length);
        if (newMarkers.length > 0) {
            if (update) {
                console.log("update !!!<-")
                setMarkers((markers: SeriesMarker<Time>[]) => {
                    return [
                        ...markers,
                        ...newMarkers
                    ];
                });
            } else {
                console.log("set !!!<-")
                setMarkers(newMarkers);
            }
        }
    }
}

// __________________________________ update
function createUpdateModifier(
    seriesRef: React.MutableRefObject<ChartSeriesRef>,
    updateFeedMarkers: UpdateFeedsMarkersCallback<IIndicatorValue>,
    maxIndicatorValueRef: React.MutableRefObject<number>
): SerieUpdateModifierCallback<IFeedData> {
    return (data: IFeedData) => {
        console.log('feeder.update :::::::::::data:::::::');
        console.log(data)
        if (seriesRef.current) {
            console.log("ref exists !!!!!!!!");
            // update the serie
            console.log("update");
            console.log("candles =====")
            console.log(data.candles)
            // ___________________________ updating the candles
            for (const candle of data.candles) {
                console.log("----candle----->");
                console.log(candle);
                seriesRef.current.candleStick.update(candle);
            }

            // ___________________________ updating the values
            for (const valueData of data.indicatorValues) {
                updateMaxIndicatorValue_oneValue(valueData, maxIndicatorValueRef);

                seriesRef.current.whalesValueLineSerie.update(valueData);
            }

            // ___________________________ updating markers
            updateFeedMarkers(data.indicatorValues);
        }
    }
}
function createUpdateManyModifier(
    seriesRef: React.MutableRefObject<ChartSeriesRef>,
    updateFeedMarkers: UpdateFeedsMarkersCallback<IIndicatorValue>,
    maxIndicatorValueRef: React.MutableRefObject<number>
): SerieUpdateModifierCallback<IFeedData[]> {
    return (data: IFeedData[]) => {
        console.log('feeder.updateMany ::::::::::::::::::');
        if (
            seriesRef.current &&
            seriesRef.current.candleStick &&
            seriesRef.current.whalesValueLineSerie
        ) {
            console.log("REF EXISTS")
            console.log(data)
            // update the serie
            console.log("update")
            for (const d of data) {
                console.log("--->")
                console.log(data)
                console.log("--->")
                console.log({
                    candleStickREf: seriesRef.current.candleStick,
                    whalesValueLineSerie: seriesRef.current.whalesValueLineSerie
                })

                // _______________________________ updating candles
                for (const candle of d.candles) {
                    seriesRef.current.candleStick.update(candle);
                }

                // __________________________ updating values
                for (const valueData of d.indicatorValues) {
                    updateMaxIndicatorValue_oneValue(valueData, maxIndicatorValueRef);
                    seriesRef.current.whalesValueLineSerie.update(valueData);

                }

                // ___________________________ updating markers
                updateFeedMarkers(d.indicatorValues);
            }
            // update the markers
        }
    }
}
// ___________________________________ set
// __________________________________ update
function createSetModifier(
    seriesRef: React.MutableRefObject<ChartSeriesRef>,
    updateFeedMarkers: UpdateFeedsMarkersCallback<IIndicatorValue>,
    maxIndicatorValueRef: React.MutableRefObject<number>
): SerieUpdateModifierCallback<IFeedData> {
    return (data: IFeedData) => {
        console.log('feeder.update ::::::::::::::::::')
        if (
            seriesRef.current &&
            seriesRef.current.candleStick &&
            seriesRef.current.whalesValueLineSerie
        ) {
            console.log("ref exists !!!!!!!!")
            // update the serie
            console.log("update")
            seriesRef.current.candleStick.setData(data.candles);
            seriesRef.current.whalesValueLineSerie.setData(data.indicatorValues);
            updateMaxIndicatorValue(data.indicatorValues, maxIndicatorValueRef);

            // update the markers
            updateFeedMarkers(data.indicatorValues, false);
        }
    }
}

function updateMaxIndicatorValue(
    indicatorValues: IIndicatorValue[],
    maxIndicatorValueRef: React.MutableRefObject<number>
) {
    if (indicatorValues) {
        for (const valueData of indicatorValues) {
            console.log({
                maxVALUE: maxIndicatorValueRef.current,
                current: valueData.value
            })
            updateMaxIndicatorValue_oneValue(valueData, maxIndicatorValueRef);
        }
    }
}

function updateMaxIndicatorValue_oneValue(
    valueData: IIndicatorValue,
    maxIndicatorValueRef: React.MutableRefObject<number>
) {
    if (
        maxIndicatorValueRef.current as number < valueData.value ||
        !maxIndicatorValueRef.current
    ) {
        maxIndicatorValueRef.current = valueData.value;
    }
}





interface ChartSeriesRef {
    candleStick: ISeriesApi<"Candlestick">,
    whalesValueLineSerie: ISeriesApi<"Line">
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
    const [buyFinalSignalMarkers, setBuyFinalSignalMarkers] = useState<SeriesMarker<Time>[]>([]);
    const chartRef = useRef<IChartApi>();
    const chartContainerRef = useRef<any>();
    const seriesRef = useRef<ChartSeriesRef>({} as ChartSeriesRef);
    const maxIndicatorValueRef = useRef<number>(NaN);
    // const candleSticksSeriesRef = useRef<ISeriesApi<"Candlestick"> | undefined>();

    useEffect(() => {
        // _________________________________________ component mounted

        // _______________________________ create chart
        chartRef.current = createChart(chartContainerRef.current, {
            ...defaultChartOptions[defaultChartOptionsName],
            ...chartOptions,
        });

        chartContainerRef.current.style.position = 'relative';

        const valueLabel = document.createElement('div');
        valueLabel.style.width = '60px';
        valueLabel.style.height = '25px';
        valueLabel.style.textAlign = 'center';
        valueLabel.style.position = 'absolute';
        valueLabel.style.right = `10px`;
        valueLabel.style.background = 'blue';
        valueLabel.style.color = 'white';
        valueLabel.style.zIndex = '10';

        chartContainerRef.current.appendChild(valueLabel);


        // ___________ candles sticks series
        seriesRef.current.candleStick = chartRef.current.addCandlestickSeries({
            // TODO: options go here
            upColor: 'rgba(255, 144, 0, 1)',
            downColor: '#000',
            borderDownColor: 'rgba(255, 144, 0, 1)',
            borderUpColor: 'rgba(255, 144, 0, 1)',
            wickDownColor: 'rgba(255, 144, 0, 1)',
            wickUpColor: 'rgba(255, 144, 0, 1)',
        });

        const updateFeedMarkers = getUpdateFeedsMarkers<IChartCandle, 'Candlestick'>(
            setMarkers
        );
        // TODO: children => composition! line series ...etc

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
        seriesRef.current.candleStick
    ) {
        seriesRef.current.candleStick.setMarkers(markers);
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
