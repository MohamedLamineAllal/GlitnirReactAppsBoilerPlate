import React, { Component } from 'react';
import styled from 'styled-components';
import ProcessSelectAndAction from './ProcessSelectAndAction';
import UserSelect from './UserSelect';
import { SimpleButton } from '../../../../shared/UI_Elements/Button'
import { Stop, Launch } from 'grommet-icons';
import { useStores } from '../../../../../stores';
import { startResumeAProcess, stopARunningProcess } from '../../eventsHandling/handlers';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

const Container = styled.div`
    display: flex;
    align-items: center;
    height: 50px;
    border-bottom: solid 1px #D9D9E5;
    background: #f9f9f9;
`;

const StartStopButton = styled(SimpleButton)`
    margin-left: 30px;
    height: 40px;
`;

export default observer(function TopControlAndToolsBar () {
    const stores = useStores();
    const tradingViewDomainStore = stores.tradingViewStore.domain;

    console.log("TOP CONTROL AND TOOLS BAR ! RENDER !");
    console.log('SELECTED PROCESS ===');
    console.log(toJS(tradingViewDomainStore.selectedProcess));

    return <Container>
        <UserSelect />
        <ProcessSelectAndAction />
        <StartStopButton
            primary
            icon={
                tradingViewDomainStore.selectedProcess? 
                    tradingViewDomainStore.selectedProcess.state === 'Running'?
                        <Stop />:
                        <Launch />
                    :
                    <Launch />
            }
            label={
                tradingViewDomainStore.selectedProcess? 
                    tradingViewDomainStore.selectedProcess.state === 'Running'?
                        'Stop':
                        'Start'
                    :
                    'Start'
            }
            onClick={async () => {
                if (tradingViewDomainStore.selectedProcess) {
                    if (tradingViewDomainStore.selectedProcess.state === 'Running') {
                        /**
                         * Running (and need to be stopped)
                         */
                        try {
                            await stopARunningProcess(tradingViewDomainStore.selectedProcessId);
                        } catch(err) {
                            /**
                             * err Notification 
                             * 
                             */
                        }
                    } else {
                        /**
                         * Stopped (and need to be started)
                         */
                        try {
                            await startResumeAProcess(tradingViewDomainStore.selectedProcessId);
                        } catch(err) {
                            /**
                             * err Notification 
                             * 
                             */
                        }
                    }
                }
            }}
        />
    </Container>;
});


/**
 *  Very important 
 * 
 *  Handle the system start and availability !!!
 * Track state! (disable controls when it's not ready yet!)
 * (connection and system readiness)
 * 
*/