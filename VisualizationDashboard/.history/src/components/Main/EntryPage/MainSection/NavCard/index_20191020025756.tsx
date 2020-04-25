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
`;

export interface CardImageContainerProps {
    height?: string
}

const CardImagContainer = styled.div`
    height: ${(props: CardImageContainerProps) => props.height || '60%'};
`;

const CardImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const CardFooterContainer = styled.div`
    justify-content: center;
    align-items: center;
`;

const Text = styled.span`
  
`;

export interface NavCardProps {
    footerText: string,
    img: {
        src: string,
        alt?: string
    }
}

export default function NavCard(props: NavCardProps) {
    const {
        footerText,
        img
    } = props;

    return <CardContainer>
        <CardImagContainer>
            <CardImage src={img.src} alt={img.alt}/>
        </CardImagContainer>
        <CardFooterContainer>
            <Text>
                { footerText }
            </Text>
        </CardFooterContainer>
    </CardContainer>;
}