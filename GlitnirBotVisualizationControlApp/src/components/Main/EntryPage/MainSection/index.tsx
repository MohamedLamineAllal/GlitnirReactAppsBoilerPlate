import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import NavCard, { NavCardProps } from './NavCard';
import { tradingViewRoute, backTestingRoute } from '../../../../routes';

const Container = styled.div`
    display: grid;
    width: 100%;
    padding: 15px;
`;

export interface StyledNavCardProps {
    footerText: string,
    img: {
        src: string,
        alt?: string
    }
}

const StyledNavCard = styled(NavCard)`
    border: solid 10px #5454d0;
    box-shadow: 0px 6px 10px #ccc;
    margin: 10px;
` as any;

export default function MainSection() {
    const history = useHistory();

    return  <Container>
        {
            [
                {
                    route: tradingViewRoute,
                    src: '',
                    alt: 'Trading view',
                    footerText: 'TradingView'
                },
                {
                    route: backTestingRoute,
                    src: '',
                    alt: 'Back testing',
                    footerText: 'Back testing'
                }
            ]
            .map(({
                route,
                src,
                alt,
                footerText
            }, index) => {
                return (
                    <StyledNavCard
                        key={index}
                        onClick={() => {
                            console.log(('HI THERE CHANGE PAGE !!!'))
                            console.log(route);
                            history.push(route);
                        }}
                        img={{
                            src,
                            alt
                        }}
                        footerText={footerText} 
                    />
                )
            })
        }
    </Container>
} 