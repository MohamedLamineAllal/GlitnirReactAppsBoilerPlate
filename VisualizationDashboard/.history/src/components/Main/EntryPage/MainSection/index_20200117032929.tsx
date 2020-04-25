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
            img={{
                src: `${dashboardBaseRoute}/`,
                alt: 'Dashboard'
            }}
            footerText="Whales one Dashboard"
        />
    </Container>
}
