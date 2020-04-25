import React, { useRef, useEffect, Ref, RefObject } from 'react';
import { createChart, IChartApi, DeepPartial, ChartOptions, ISeriesApi, BarData, HistogramData, LineData } from 'lightweight-charts';
import { TradingViewOneData, BuySellPoint, Candle } from '../../../../../../types/trading';
import styled from 'styled-components';


//______________________________________ chart 

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


// _____________________________________  data modifier

export type SerieType = "Bar" | "Candlestick" | "Area" | "Line" | "Histogram";

export type UpdateCandlesCallback = (candle: Candle | Candle[]) => void;
export type setCandlesCallback = (candles: Candle[]) => void;
export type SerieUpdateModifierCallback<DataType> = (data: DataType | DataType[]) => void;
export type SerieSetModifierCallback<DataType> = (data: DataType[]) => void;
// __________________________________ update
function createUpdateModifier<ModifierDataType=any>(ref: RefObject<ISeriesApi<any> | undefined>): SerieUpdateModifierCallback<ModifierDataType> {
	return (data: ModifierDataType | ModifierDataType[]) => {
		if (ref.current) {
			if (Array.isArray(data)) {
				if (ref.current) {
					for (let _candle of data) {
						ref.current.update(_candle);
					}
				}
			} else {
				ref.current.update(data);
			}
		}
	}
}
// ___________________________________ set
function createSetModifier<ModifierDataType=any>(ref: RefObject<ISeriesApi<any> | undefined>): SerieSetModifierCallback<ModifierDataType>{
	return (data: ModifierDataType[]) => {
		if (ref.current) {
			ref.current.setData(data);
		}
	}
}


// ____________________________ component and props

interface TradingChartProps {
	className?: string,
	// candles: Candle[],
	getUpdateCandles?: (callback: SerieUpdateModifierCallback<Candle>) => void, 
	getSetCandles: (callback: SerieSetModifierCallback<Candle>) => void, 
	theme?: TradingChartTheme,
	chartOptions?: DeepPartial<ChartOptions>,
	defaultChartOptionsName?: keyof typeof defaultChartOptions,
}


export default ({
	getUpdateCandles,
	getSetCandles,
	className,
	theme,
	chartOptions={},
	defaultChartOptionsName = 'candles'
}: TradingChartProps) => {
	const chartRef = useRef<IChartApi>();
	const chartContainerRef = useRef<any>();
	const candleSticksSeriesRef = useRef<ISeriesApi<"Candlestick"> | undefined>();

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
		// ________________ passing update method
		if (getUpdateCandles) getUpdateCandles(createUpdateModifier<Candle>(candleSticksSeriesRef));
		if (getSetCandles) getSetCandles(createSetModifier<Candle>(candleSticksSeriesRef));

		// _______________________________________________ component unmounted
		return () => {
			// _______________________________________clean up 
		};
	}, []);

	// TODO: add theme styles
	return <Container className={className}>
		<ChartContainer ref={chartContainerRef}/>
	</Container>
}