import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { CheckBox, Button, Select } from "grommet";
import { Add } from "grommet-icons";
import ProcessSelect from './ProcessSelect';
import UserSelect from './UserSelect';
import { SimpleButton } from '../../../shared/UI_Elements/Button';
import DropdownDateTimePicker from '../../../shared/UI_Elements/DropdownDateTimePicker';
import { useStores, StoresContext } from '../../../../stores';
import { startBackTesting } from '../eventsHandling/handlers';

const ConfigMenu = styled.nav`
  width: 100vw;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #f5f6fa;
`;

export default observer(() => {
    const stores = useStores();
    const backTestingDomainStore = stores.backTestingStore.domain;
    const topControlBarState = stores.backTestingStore.ui.topControlBar;

    return <ConfigMenu>
        <UserSelect />
        <ProcessSelect />
        <CheckBox
            toggle
            checked={backTestingDomainStore.realTime}
            label={"RealTime"}
            onChange={(event) => {
                backTestingDomainStore.realTime = event.target.checked;
            }}
        />
        <DropdownDateTimePicker
            dateTime={backTestingDomainStore.startDateTime}
            open={topControlBarState.startDateTime.open} 
            onDateTimeChange={(dateTime: Date) => {
                backTestingDomainStore.startDateTime = dateTime;
            }}
            onClose={() => {
                topControlBarState.startDateTime.open = false;
            }}
            onOpen={() => {
                topControlBarState.startDateTime.open = true;
            }}
            placeholder="Start Time"
        />
        <DropdownDateTimePicker
            dateTime={backTestingDomainStore.endDateTime}
            open={topControlBarState.endDateTime.open} 
            onDateTimeChange={(dateTime: Date) => {
                backTestingDomainStore.endDateTime = dateTime;
            }}
            onClose={() => {
                topControlBarState.endDateTime.open = true;
            }}
            onOpen={() => {
                topControlBarState.endDateTime.open = true;
            }}
            placeholder="End Time"
        />
        <SimpleButton primary label="Test" onClick={() => {
            startBackTesting(stores);
        }} />
    </ConfigMenu>
});