import React from 'react';
import styled from 'styled-components';


const BoxContainer = styled.div`
    display: flex;
    width: 300px;
    height: 50px;
    background: #fff5f5;
    border: solid 1px #FDFDFD;
`;

const Controller = styled.div`
    display: flex;
    width: 50px;
    height: 50px;
    background: #fbfaff;
    border: solid 1px #f1f1ff;
    color: #1a1adc;
    justify-content: center;
    align-items: center;
`;

export interface ComponentProps {
    onReset: () => void
}

export default (({
    onReset
}) => {
    return <BoxContainer>
        <Controller onClick={onReset}>
            Reset
        </Controller>
    </BoxContainer>
}) as React.ComponentType<ComponentProps>


