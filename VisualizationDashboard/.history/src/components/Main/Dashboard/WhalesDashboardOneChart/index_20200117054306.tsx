import React, { useState, useEffect, useRef, useLayoutEffect } from "react";

import styled from 'styled-components';
import eventEmitterService from "../../../../services/eventEmitterService";

import config from '../../../../config';
import { StreamData } from "../../../../services/streamsConnector/streamsConnector";

import ControlBox from './ControlBox';
import { WhalesCandle } from "../../../../types/trading";
import { DataFeeder } from "../../../types/VisualizationSystem";
import { get_processFeedCache } from '../../../utils/cache';
import { WhalesChart } from '../../../CustomComponents/DataVisualization/WhalesChart';


const DashboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const ControlBoxContainer = styled.div`
    display: flex;
    justify-content: center;
`;

interface BoxesState {
    [boxId: string]: any
}


interface StreamDataAction {
    type: 'init' | 'feed',
    payload: WhalesCandle[]
}

interface BoxRefObj {
    feeder?: DataFeeder,
    cache: WhalesCandle[][]
}

// _____ [method]
const processFeedCache = get_processFeedCache();
function processCacheAndUpdate(
    feed: any,
    cache: any[],
    bufferMethod: (data: any) => void
) {
    console.log("processCacheAndUpdate() :::::::::");
    console.log("Cache: (length: " + cache.length + ")");
    console.log(cache);

    if (cache.length > 0) {
        console.log('CACHE NOT EMPTY: PROCESS FEED CACHE')
        processFeedCache(
            cache,
            bufferMethod
        );
    }

    if (feed) {
        console.log("PROCESS THE FEED !!!!!!!")
        console.log(feed);
        console.log("---bufferMethod--->")
        bufferMethod(feed);
    }
}


const WHALES_ONE_CHART_ID = 'WHALES_ONE_CHART';

function initDashboard(boxesRefMap: Map<string, BoxRefObj>) {
    console.log("init dashboard !!::::::::")
    boxesRefMap.set(
        WHALES_ONE_CHART_ID,
        {
            feeder: undefined,
            cache: []
        }
    );
}


// _____ control management
function control_onReset(boxesRef: Map<string, BoxRefObj>) {
    for (const boxRef of boxesRef.values()) {
        boxRef.cache = [];
        if (boxRef.feeder) {
            boxRef.feeder.set([]); // TODO: check
        }

        // TODO: on state reset
    }
}

interface DashboardProps {
    id: string
}

export default (function WhalesDashboardOneChart({
    id
}) {
    // init data
    //  type, data: initialData, width, ratio
    // TODO: LATER USE MOBX

    // (boxId, boxRefObj)
    console.log("Component");
    const [boxesState, setBoxesState] = useState<BoxesState>({
        [WHALES_ONE_CHART_ID]: {} // TODO:
    });

    const boxesRef = useRef(new Map<string, BoxRefObj>());

    useLayoutEffect(() => {
        console.log('im in render mmmmm');
        initDashboard(boxesRef.current);

        eventEmitterService.on(
            config.clientsCommunication.streamsConnector.dataEventName,
            (data: StreamData<StreamDataAction>) => {
            console.log('::::::::::::::::::::::::! GOT DATA !:::::::::::::::::::::::::::');
            console.log(data);
            console.log({
                dashboardId: id,
                boxesKeys: Object.keys(boxesState)
            });
            if (id === data.dashboardId && Object.keys(boxesState).includes(data.boxId)) {
                console.log("DASHBOARD ID CORRECT AND BOX ID TOO")
                let boxRef: BoxRefObj | undefined;
                switch (data.data.type) {
                    case 'feed':
                        boxRef = boxesRef.current.get(data.boxId);

                        console.log("FEED type ::::::::");

                        if (boxRef) {
                            console.log("BOX REF MMMM");
                            console.log(boxRef);

                            if (boxRef.feeder) {
                                console.log("WE GET FEEDER");
                                processCacheAndUpdate(
                                    data.data.payload,
                                    boxRef.cache,
                                    boxRef.feeder.updateMany
                                );
                            } else {
                                console.log("no feeder yet !!!");
                                console.log("push to cache !!!!!")
                                console.log(boxRef.cache);
                                boxRef.cache.push(data.data.payload);
                            }
                        }
                        break;
                    case 'init':
                        // TODO:
                        break;
                }
            }
        });
    }, []);

    // console.log(candles.slice(candles.length - 1000));
    console.log("window size")
    console.log({
        height: window.innerHeight,
        width: window.innerWidth
    });
    return (
        <DashboardContainer>
            <ControlBoxContainer>
                <ControlBox
                    onReset={() => {
                        control_onReset(boxesRef.current);
                    }}
                />
            </ControlBoxContainer>
            <WhalesChart
                chartOptions={{
                    width: window.innerWidth,
                    height: window.innerHeight - 140,
                    layout: {
                        backgroundColor: '#20272F',
                        textColor: '#4EC5F1'
                    },
                    priceScale: {
                        borderColor: "#6da76F",
                    }
                }}
                getFeeder={(feeder) => {
                    console.log("get :::: feeder :::::");
                    if (feeder) {
                        const boxRef = boxesRef.current.get(WHALES_ONE_CHART_ID);
                        if (boxRef) {
                            console.log("feeder get: :: : boxref yes");
                            boxRef.feeder = feeder;
                            processCacheAndUpdate(
                                undefined,
                                boxRef.cache,
                                feeder.updateMany
                            );
                        }
                    }
                }}
            />
        </DashboardContainer>
    );
}) as React.FC<DashboardProps>;

/**
 * TODO: the whole dashboard for test is not dynamic!
 * work on the dynamic version
 *
 */
