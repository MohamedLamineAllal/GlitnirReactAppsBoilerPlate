import React, { useState, useEffect } from "react";
//@ts-ignore
import { ChartCanvas, Chart } from "react-stockcharts";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import {
	CandlestickSeries,
	LineSeries
	//@ts-ignore
} from "react-stockcharts/lib/series";
//@ts-ignore
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	EdgeIndicator,
	CurrentCoordinate,
	MouseCoordinateX,
	MouseCoordinateY
	//@ts-ignore
} from "react-stockcharts/lib/coordinates";

import {
	LabelAnnotation,
	Label,
	Annotate
	//@ts-ignore
} from "react-stockcharts/lib/annotation";
//@ts-ignore
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
//@ts-ignore
import { fitWidth } from "react-stockcharts/lib/helper";
//@ts-ignore
import { last } from "react-stockcharts/lib/utils";
import {
	OHLCTooltip,
	MovingAverageTooltip
	//@ts-ignore
} from "react-stockcharts/lib/tooltip";

import { ChartMargin } from "../../../declarations/react-stockcharts";

import { Candle, GoldScriptCandle } from "../../../declarations/trading";

import GoldScript, { CandlesBuffers } from "../../../imported/goldScript";
import { calculateAllCandles, GoldScriptBuySellSerie } from "./calculation";

let fs: { promises: { readFile: Function } };
// @ts-ignore
if (window.require) {
	var {
		promises: { readFile }
		// @ts-ignore
	} = window.require("fs");
	//@ts-ignore
	var { homedir } = window.require("os");
	// @ts-ignore
	var path = window.require("path");
}

interface TradingCandlesSavedData {
	metadata: Object;
	candles: Candle[];
}

interface TradingChartProps {
	candles: (Candle | GoldScriptCandle)[];
	ratio: number;
	type: "svg" | "hybrid";
}

interface MyTradingChartProps {
	showGrid?: boolean;
}

function getInitialData(file: string): Promise<TradingCandlesSavedData> {
	return new Promise(async (resolve, reject) => {
		try {
			const data = JSON.parse(
				await (readFile(file) as Promise<
					any
				>)
			);
			data.candles = data.candles.map((candle: Candle) => {
				for (let key of Object.keys(candle)) {
					//@ts-ignore
					if (typeof candle[key] === "string") {
						//@ts-ignore
						candle[key] = parseFloat(candle[key]);
					}
				}
				return candle;
			});
			resolve(data);
		} catch (err) {
			reject(err);
		}
	});
}

function isBuySignal(candle: GoldScriptCandle) {
	return candle.buy;
}

function isSellSignal(candle: GoldScriptCandle) {
	return candle.sell;
}

function TradingChart({
	candles,
	ratio,
	type,
	showGrid = true
}: TradingChartProps & MyTradingChartProps) {
	const width: number = window.innerWidth - 50;
	const height: number = Math.max(window.innerHeight - 400, 600);

	const sellAnnotationProps = {
		fontFamily: "Glyphicons Halflings",
		fontSize: 20,
		fill: "#2432fd",
		opacity: 0.8,
		text: "S",
		y: ({ yScale }: { yScale: any }) => yScale.range()[0],
		onClick: console.log.bind(console),
		tooltip: (candle: GoldScriptCandle) =>
			timeFormat("%B")(new Date(candle.openTime))
		// onMouseOver: console.log.bind(console),
	};
	const buyAnnotationProps = {
		fontFamily: "Glyphicons Halflings",
		fontSize: 20,
		fill: "#4ad61f",
		opacity: 0.8,
		text: "B",
		y: ({ yScale }: { yScale: any }) => yScale.range()[0],
		onClick: console.log.bind(console),
		tooltip: (candle: GoldScriptCandle) =>
			timeFormat("%B")(new Date(candle.openTime))
		// onMouseOver: console.log.bind(console),
	};

	const margin: ChartMargin = { left: 80, right: 80, top: 30, bottom: 50 };

	const yAxisLabelX = width - margin.left - 40;
	const yAxisLabelY = (height - margin.top - margin.bottom) / 2;

	const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
		(candle: GoldScriptCandle) => new Date(candle.openTime)
	);

	const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
		candles
	);

	const start = xAccessor(last(data));
	const end = xAccessor(data[Math.max(0, data.length - 150)]);
	const xExtents = [start, end];

	// Grid
	var gridHeight = height - margin.top - margin.bottom;
	var gridWidth = width - margin.left - margin.right;

	var yGrid = showGrid
		? {
				innerTickSize: -1 * gridWidth,
				tickStrokeDasharray: "Solid",
				tickStrokeOpacity: 0.2,
				tickStrokeWidth: 1
		  }
		: {};
	var xGrid = showGrid
		? {
				innerTickSize: -1 * gridHeight,
				tickStrokeDasharray: "Solid",
				tickStrokeOpacity: 0.2,
				tickStrokeWidth: 1
		  }
		: {};

	return (
		<ChartCanvas
			height={height}
			ratio={ratio}
			width={width}
			margin={margin}
			type={type}
			seriesName="MSFT"
			data={data}
			xScale={xScale}
			xAccessor={xAccessor}
			displayXAccessor={displayXAccessor}
			xExtents={xExtents}
		>
			<Label
				x={(width - margin.left - margin.right) / 2}
				y={30}
				fontSize={30}
				text="Chart title here"
			/>

			<Chart
				id={1}
				yExtents={[(d: GoldScriptCandle) => [d.high, d.low]]}
				padding={{ top: 10, bottom: 20 }}
			>
				<XAxis axisAt="bottom" orient="bottom" {...xGrid} />
				<MouseCoordinateX
					at="bottom"
					orient="bottom"
					displayFormat={timeFormat("%Y-%m-%d")}
				/>

				<Label
					x={(width - margin.left - margin.right) / 2}
					y={height - 45}
					fontSize={12}
					text="XAxis Label here"
				/>

				<YAxis axisAt="right" orient="right" ticks={5} {...yGrid} />

				<MouseCoordinateY
					at="right"
					orient="right"
					displayFormat={format(".2f")}
				/>

				<Label
					x={yAxisLabelX}
					y={yAxisLabelY}
					rotate={-90}
					fontSize={12}
					text="YAxis Label here"
				/>

				<CandlestickSeries />
				<EdgeIndicator
					itemType="last"
					orient="right"
					edgeAt="right"
					yAccessor={(d: GoldScriptCandle) => d.close}
					fill={(d: GoldScriptCandle) =>
						d.close > d.open ? "#6BA583" : "#FF0000"
					}
				/>

				<OHLCTooltip origin={[-40, 0]} />

				<Annotate
					with={LabelAnnotation}
					when={(d: GoldScriptCandle) => isBuySignal(d)}
					usingProps={buyAnnotationProps}
				/>
				<Annotate
					with={LabelAnnotation}
					when={(d: GoldScriptCandle) => isSellSignal(d)}
					usingProps={sellAnnotationProps}
				/>
			</Chart>
			<CrossHairCursor strokeDasharray="LongDashDot" />
		</ChartCanvas>
	);
}

export default function GoldScriptTest() {
	// init data
	//  type, data: initialData, width, ratio

	let [candles, setCandles] = useState([]);
	let [dataInfo, setDataInfo] = useState({});
	let [dataFileName, setDataFileName] = useState("");

	useEffect(() => {});

	function fetchData_onFileNameChange({
		target: { value }
	}: {
		target: { value: string };
	}) {
		setDataFileName(value);
	}

	async function getData() {
		const _data = await getInitialData(
				dataFileName
			) /*.map(candle => ({ ...candle, new Date()}))*/;
		// const candlesBuffer: CandlesBuffers = _data.candles.reduce(
		// 	(buffers: CandlesBuffers, candle: Candle) => {
		// 		candlesBuffer.open.push(candle.open);
		// 		candlesBuffer.low.push(candle.low);
		// 		candlesBuffer.high.push(candle.high);
		// 		candlesBuffer.close.push(candle.close);
		// 		candlesBuffer.volume.push(candle.volume);

		// 		return candlesBuffer;
		// 	},
		// 	{
		// 		open: [],
		// 		low: [],
		// 		high: [],
		// 		close: [],
		// 		volume: []
		// 	}
		// );

		console.log("initial data gotten");
		const backOffset: number = 60;
		const buySellIndicators: GoldScriptBuySellSerie = calculateAllCandles(
			_data.candles,
			backOffset
		);

		// console.log(
		// 	"buy true found => " +
		// 		buySellIndicators.buy.find(signal => signal == true)
		// 		? "yes"
		// 		: "no"
		// );
		// console.log(
		// 	"sell true found => " +
		// 		buySellIndicators.sell.find(signal => signal == true)
		// 		? "yes"
		// 		: "no"
		// );

		// for (
		// 	let i = buySellIndicators.buy.length - 1000;
		// 	i < buySellIndicators.buy.length;
		// 	i++
		// ) {
		// 	console.log({
		// 		buy: buySellIndicators.buy[i],
		// 		sell: buySellIndicators.sell[i]
		// 	});
		// }

		// console.log({
		// 	buy: buySellIndicators.buy.slice(buySellIndicators.buy.length / 4),
		// 	sell: buySellIndicators.sell.slice(
		// 		buySellIndicators.sell.length / 4
		// 	)
		// });

		setDataInfo(_data.metadata);
		setCandles(_data.candles.map(
			(candle, index) =>
				({
					...candle,
					buy:
						index - backOffset >= 0
							? buySellIndicators.buy[index - backOffset]
							: false,
					sell:
						index - backOffset >= 0
							? buySellIndicators.sell[index - backOffset]
							: false
				} as GoldScriptCandle)
		) as never[]);
	}

	// console.log(candles.slice(candles.length - 1000));

	return (
		<div className="GoldScriptTest">
			<div className="fetchData">
				<div>
					<label>File Name:</label>
					<input
						type="text"
						onChange={fetchData_onFileNameChange}
						value={dataFileName}
					/>
				</div>
				<button onClick={getData}>Get Data</button>
			</div>

			{candles.length > 0 && (
				<TradingChart candles={candles} ratio={1} type="hybrid" />
			)}
		</div>
	);
}
