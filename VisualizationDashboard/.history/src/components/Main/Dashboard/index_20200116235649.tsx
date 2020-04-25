import React from 'react';
import WhalesDashboard from './WhalesDashboard';
import styled from 'styled-components';
import IndicatorsBox from './Indicators';
import {  } from './WhalesDashboardOneChart';


const DashboardPageContainer = styled.div`
    width: 100%;
    height: 100%;
`;

export interface DashboardObj {
    id: string,
    Component: React.FC
}
export interface Dashboards {
    [id: string]: DashboardObj
}

const Dashboards = {
    []
}

export default () => {
    return <DashboardPageContainer>
        <IndicatorsBox />
        <WhalesDashboard id="WhalesDashboard"/>;
    </DashboardPageContainer>
}
