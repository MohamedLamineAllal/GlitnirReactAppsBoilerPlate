import React, { useState, useEffect, useRef, RefObject } from "react";
import TradingChart, { SerieSetModifierCallback, SerieUpdateModifierCallback } from './chart';
import styled from 'styled-components';
import { TradingViewOneData, Candle, TrailingData, BuySellPoint, BuySellSignal } from "../../../../../types/trading";
import { ipcClient } from "../../../../../services/ipcClients/glitnirTradingSystem";
import config from "../../../../../config";


export interface Context {

}

export interface IpcHandlers {
    handleRealTimeCandleFeed: (candle: Candle | Candle[]) => void,
    handleRealTimeBuySellSignalFeed: (buySellSignal: BuySellSignal | BuySellSignal[]) => void,
    handleTrailingDataFeed: (data: TrailingData | TrailingData[]) => void
}

// _____________________________________ init data

function initData(
    setCandles: SerieSetModifierCallback<Candle> | undefined,
    updateCandles: SerieUpdateModifierCallback<Candle> | undefined
) {
    if (setCandles) {
        initCandlesData(setCandles);
    }
}

async function initCandlesData(setCandles: SerieSetModifierCallback<Candle>) {
    // TODO: get initial data
    // const candles = await ipcClient.request({
    // 	eventName: config.ipc.ipcEvents.,
    // 	data: {

    // 	},
    // 	processId: config.ipc.dataSourceProcessId
    // });

    // setCandles(candles);
}


// __________________________________________ connect to real time stream

async function connectRealTimeStreams(
    setCandles: SerieSetModifierCallback<Candle>,
    updateCandles: SerieUpdateModifierCallback<Candle>
) {
    // _______________________________ real time feed handlers

    function handleRealTimeCandleFeed(candle: Candle | Candle[]) {
        updateCandles(candle);
    }

    function handleRealTimeBuySellSignalFeed(buySellPoint: BuySellSignal) {

    }

    function handleTrailingDataFeed(data: TrailingData) {

    }

    // _______________________________ register handlers and connect to streams
    await ipcClient.onLoginSuccess();
    // ________ ipc client logged
    // ipcClient
    // 	.on('', handleRealTimeCandleFeed); // TODO:
    // .on('', handleRealTimeBuySellSignalFeed); // TODO:
    // .on('', handleTrailingDataFeed); // TODO:

    return {
        handleRealTimeCandleFeed,
        handleRealTimeBuySellSignalFeed,
        handleTrailingDataFeed
    }
}

async function clearRealTimeStreamsConnections(ipcHandlers: IpcHandlers) {
    ipcClient.removeListener('', ipcHandlers.handleRealTimeCandleFeed);
    ipcClient.removeListener('', ipcHandlers.handleRealTimeBuySellSignalFeed);
    ipcClient.removeListener('', ipcHandlers.handleTrailingDataFeed);
}









// ____________________________________________________ component and props

const TradingViewPageContainer = styled.div`

`;

const TradingViewContainer = styled.div`

`;

export interface TradingViewProps {
    data: TradingViewOneData[]
}

export default function TradingView({
    data
}: TradingViewProps) {
    const setCandlesRef = useRef<SerieSetModifierCallback<Candle>>();
    const updateCandlesRef = useRef<SerieUpdateModifierCallback<Candle>>();

    useEffect(() => {
        // _________________________________________ component mounted

        // _________________________________ init data
        initData(setCandlesRef.current, updateCandlesRef.current);

        // _________________________ register to real time streams
        connectRealTimeStreams(setCandlesRef.current as any, updateCandlesRef.current as any);

        // _________________________________________ component unmounted
        return () => {
            // ___________________ clean real time streams
        }
    }, []);

    return (
        <TradingViewContainer>
            { data.length > 0 && (
                <TradingChart
                    getSetCandles={ (callback: SerieSetModifierCallback<Candle>) => {
                        if (!setCandlesRef.current) {
                            setCandlesRef.current = callback;
                        }
                    } }
                    getUpdateCandles={ (callback: SerieUpdateModifierCallback<Candle>) => {
                        if (!updateCandlesRef.current) {
                            updateCandlesRef.current = callback;
                        }
                    } }
                />
            ) }
        </TradingViewContainer>
    );
}
