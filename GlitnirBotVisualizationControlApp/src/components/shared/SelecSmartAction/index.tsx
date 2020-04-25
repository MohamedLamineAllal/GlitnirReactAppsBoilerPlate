import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;

`;


export interface SelectSmartActionProps {
    selectComponent: React.ComponentElement<{
        onChange: () => void
    }, any>
}

export default (function SelectSmartAction ({
    selectComponent: SelectComponent
}) {
    

    return <Container>
        {
            SelectComponent
        }
    </Container>
}) as React.ComponentType<SelectSmartActionProps>;