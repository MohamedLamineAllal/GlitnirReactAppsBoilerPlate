import React, { Component } from 'react';
import styled from 'styled-components';
import TradingView from './View';
import TopControlAndToolsBar from './TopControlAndToolsBar';

const Container = styled.div`
    border: solid 1px #d6d4e2;
    flex-shrink: 0;
    flex-grow: 1;
`;

export default (function MiddlePanel() {
    return <Container>
        <TopControlAndToolsBar/>
        <TradingView data={[]}/>
    </Container>;
});