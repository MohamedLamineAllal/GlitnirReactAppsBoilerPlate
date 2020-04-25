import React from 'react';
import WhalesMultiVerticalDashboard from './WhalesMultiVerticalDashboard';
import styled from 'styled-components';
import IndicatorsBox from './Indicators';
import WhalesOneChartDashboard from './WhalesDashboardOneChart';
import { match } from 'react-router-dom';

const DashboardPageContainer = styled.div`
    width: 100%;
    height: 100%;
`;

export interface DashboardObj {
    id: string,
    Component: React.FC<{
        id: string
    }>
}
export interface Dashboards {
    [id: string]: DashboardObj
}

const DASHBOARDS: Dashboards = {
    WHALES_ONE_CHART_DASHBOARD: {
        id: 'WHALES_ONE_CHART_DASHBOARD',
        Component: WhalesOneChartDashboard
    },
    WHALES_MULTI_VERTICAL_CHARTS_DASHBOARD: {
        id: 'WHALES_MULTI_VERTICAL_CHARTS_DASHBOARD',
        Component: WhalesMultiVerticalDashboard
    }
}

interface DashboardProps {
    match: match
}

export default ({
    match: {
        params
    }
}: DashboardProps) => {
    const Dashboard = DASHBOARDS[(params as any).dashboardId].Component;
    return <DashboardPageContainer>
        <IndicatorsBox />
        <Dashboard id={(params as any).dashboardId}/>;
    </DashboardPageContainer>
}
