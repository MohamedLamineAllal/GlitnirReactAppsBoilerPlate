import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const ComponentContainer = styled.div`
    min-height: 300px;
    background: #d1d1d1;
`;

export interface VerticalContainerProps  {
    components: any[];
}

export default ({
    components
}: React.PropsWithChildren<VerticalContainerProps>) => {
    return <Container>
        {
            components.map(
                (component) => <ComponentContainer>
                     { component }
                </ComponentContainer>
            )
        }
    </Container>;
}
