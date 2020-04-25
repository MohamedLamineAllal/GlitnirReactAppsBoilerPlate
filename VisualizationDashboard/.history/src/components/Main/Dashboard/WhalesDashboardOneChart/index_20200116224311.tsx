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
    payload?: WhalesCandle[]
}

interface BoxRefObj {
    feeder?: DataFeeder,
    cache: any[]
}

// _____ [method]
const processFeedCache = get_processFeedCache();
function processCacheAndUpdate(
    feed: any,
    cache: any[],
    bufferMethod: (data: any) => void
) {
    console.log("processCacheAndUpdate() :::::::::");
    if (cache.length > 0) {
        console.log('CACHE NOT EMPTY: PROCESS FEED CACHE')
        processFeedCache(
            cache,
            bufferMethod
        );
    }

    console.log("PROCESS THE FEED !!!!!!!")
    bufferMethod(feed);
}


const WHALES_VERTICAL_DYNAMIC_BOX_ID = 'WHALES_VERTICAL_DYNAMIC_BOX';

function initDashboard(boxesRefMap: Map<string, BoxRefObj>) {
    console.log("init dashboard !!::::::::")
    boxesRefMap.set(
        WHALES_VERTICAL_DYNAMIC_BOX_ID,
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

export default (function Dashboard({
    id
}) {
    // init data
    //  type, data: initialData, width, ratio
    // TODO: LATER USE MOBX

    // (boxId, boxRefObj)
    console.log("Component");
    const [boxesState, setBoxesState] = useState<BoxesState>({
        [WHALES_VERTICAL_DYNAMIC_BOX_ID]: {} // TODO:
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
                                    boxRef.feeder.update
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

    return (
        <DashboardContainer>
            <ControlBoxContainer>
                <ControlBox
                    onReset={() => {
                        control_onReset(boxesRef.current);
                    }}
                />
            </ControlBoxContainer>
            <VerticalDynamicContainer
                id={WHALES_VERTICAL_DYNAMIC_BOX_ID}
                getFeeder={(feeder) => {
                    console.log("VERTICAL DYNAMIC CONTAINER FEEDER RESOLVED !!!!");

                    // initDashboard(boxesRef.current);

                    const boxRef = boxesRef.current.get(WHALES_VERTICAL_DYNAMIC_BOX_ID);
                    console.log("box ref !!!!");
                    console.log(boxRef);
                    if (boxRef) {
                        console.log("BOX REF EXISTS");
                        boxRef.feeder = feeder;

                        if (boxRef.cache.length > 0) {
                            console.log("PROCESS CACHE in vertical .... !!!!!!");
                            console.log(boxRef.cache)
                            processFeedCache(
                                boxRef.cache,
                                feeder.update
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
