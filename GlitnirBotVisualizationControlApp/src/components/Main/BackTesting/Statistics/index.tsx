import React from 'react';
import styled from 'styled-components';
import StatisticItem from './StatisticItem';
import { useStores } from '../../../../stores';

const StatisticsContainer = styled.div`

`;


export interface StatisticsProps {
    statistics: 
}

export default () => {
    const stores = useStores();
    const backTestingDomainStore = stores.backTestingStore.domain;

    return <StatisticsContainer>
        <StatisticItem
            statisticType={}
            longValue={}
            shortValue={}
            allValue={}
        />
    </StatisticsContainer>
}

