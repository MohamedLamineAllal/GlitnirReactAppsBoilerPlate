import React from 'react';
import WhalesDashboard from './WhalesDashboard';
import styled from 'styled-components';
import IndicatorsBox from './Indicators';
const DashboardPageContainer = styled.div`
    width: 100%;
    height: 100%;
`;




export default () => {
    return <DashboardPageContainer>
        <IndicatorsBox />
        <WhalesDashboard id="WhalesDashboard"/>;
    </DashboardPageContainer>
}
