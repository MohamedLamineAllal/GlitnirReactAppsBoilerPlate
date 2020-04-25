import React from 'react'
import styled from 'styled-components';

export interface CardContainerProps {
    width?: string,
    height?: string
}

const CardContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: .5em;
    width: ${(props: CardContainerProps) => props.width || '200px' };
    height: ${(props: CardContainerProps) => props.height || '300px'};
    /* border: solid 1px #7979e5;
    box-shadow: 0 6px 10px #ccc; */
`;

export interface CardImageContainerProps {
    height?: string,
}

const CardImagContainer = styled.div`
    height: ${(props: CardImageContainerProps) => props.height || '85%'};
`;

const CardImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const CardFooterContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    /* height: 20%; */
`;

const Text = styled.span`
    
`;

export interface NavCardProps {
    footerText: string,
    img: {
        src: string,
        alt?: string
    },
    className: string,
    onClick: () => void
}

export default (function NavCard({
    footerText,
    img,
    className,
    onClick
}) {
    return <CardContainer className={className} onClick={onClick}>
        <CardImagContainer>
            <CardImage src={img.src} alt={img.alt}/>
        </CardImagContainer>
        <CardFooterContainer>
            <Text>
                { footerText }
            </Text>
        </CardFooterContainer>
    </CardContainer>;
}) as React.ComponentType<NavCardProps>;