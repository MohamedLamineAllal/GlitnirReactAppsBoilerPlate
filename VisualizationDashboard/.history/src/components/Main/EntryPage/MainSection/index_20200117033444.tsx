import React from 'react';
import styled from 'styled-components';

import NavCard from './NavCard';
import { dashboardBaseRoute } from '../../../../routes';


const Container = styled.div`
    display: grid;
    width: 100%;
    padding: 15px;
`;

const StyledNavCard = styled(NavCard)`
    margin: 10px;
`;

export default function MainSection() {
    return  <Container>
        <StyledNavCard
            route={`${dashboardBaseRoute}/WHALES_ONE_CHART_DASHBOARD`}
            img={{
                src: '',
                alt: 'One chart Dash'
            }}
            footerText="Whales one chart Dashboard"
        />
        <StyledNavCard
            route={`${dashboardBaseRoute}/WHALES_ONE_CHART_DASHBOARD`}
            img={{
                src: '',
                alt: 'Multi charts Dash'
            }}
            footerText="Whales vertical multi charts Dashboard"
        />
    </Container>
}
