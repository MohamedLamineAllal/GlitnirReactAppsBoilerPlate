import React from 'react';
import WhalesDashboard from './WhalesDashboard';
import styled from 'styled-components';
import IndicatorsBox from './Indicators';
import WhalesOneChartDashboard from './WhalesDashboardOneChart';


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
    WHALES_ONE_CHART_DASHBOARD: {
        id: 'WHALES_ONE_CHART_DASHBOARD',
        Component: WhalesOneChartDashboard
    },
    WHALES_MULTI_VERTICAL_CHARTS_DASHBOARD: {
        id: 'WHALES_MULTI_VERTICAL_CHARTS_DASHBOARD',
        Component: 
    }
}

export default () => {
    return <DashboardPageContainer>
        <IndicatorsBox />
        <WhalesDashboard id="WhalesDashboard"/>;
    </DashboardPageContainer>
}
