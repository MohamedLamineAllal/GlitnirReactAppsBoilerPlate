import React, { useState, useEffect } from 'react';

import styled from 'styled-components';

import { eventEmitterService, globalState } from '../../../../index';
import { DEEPSTREAM_CLIENT_CONNECTED_EVENT, DEEPSTREAM_SERVER_STARTED_EVENT, DEEPSTREAM_SERVER_STOPPED_EVENT } from '../../../../services/streamsConnector/service';

interface IndicatorsContainerProps {
    active: boolean
}

const IndicatorsBox = styled.div`
    position: absolute;
    background: #EEE;
    display: flex;
    width: 20%;
    height: 100px;
    top: 0;
    right: 0;
    border-radius: 5px;
`;

const IndicatorContainer = styled('div')<IndicatorsContainerProps>`
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props: any) => props.active ?  "white" : "blue"};
    background: ${(props: any) => props.active ? 'blue': 'white'};
`;

export default () => {
    const [deepstreamServerActiveState, setDeepstreamServerActiveState] = useState(globalState.deepstreamServerActive);
    const [
        deepstreamClientConnectedState,
        setDeepstreamClientConnectedState
    ] = useState(globalState.deepstreamClientConnected);

    useEffect(() => {
        eventEmitterService.on(DEEPSTREAM_SERVER_STARTED_EVENT, () => {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            setDeepstreamServerActiveState(true);
        });

        eventEmitterService.on(DEEPSTREAM_SERVER_STOPPED_EVENT, () => {
            setDeepstreamServerActiveState(false);
        });


        eventEmitterService.on(DEEPSTREAM_CLIENT_CONNECTED_EVENT, () => {
            setDeepstreamClientConnectedState(true);
        });
    }, []);

    console.log('--------!!!!!!!!!!!!------------>')
    console.log({
        deepstreamServerActiveState,
        deepstreamClientConnectedState
    });

    return <IndicatorsBox>
        {/* deepstream server started*/}
        <IndicatorContainer active={deepstreamServerActiveState}>
            DS
        </IndicatorContainer>
        {/* deepstream client connected*/}
        <IndicatorContainer active={deepstreamClientConnectedState}>
            DC
        </IndicatorContainer>
    </IndicatorsBox>
}
