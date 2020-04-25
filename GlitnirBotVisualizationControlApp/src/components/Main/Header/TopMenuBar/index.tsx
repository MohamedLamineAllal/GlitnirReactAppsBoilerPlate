import React from 'react';
import Nav from '../../Nav';
import { LocationDescriptorObject } from 'history';
import { tradingViewRoute } from '../../../../routes';

import styled from 'styled-components';

const CurrentPathTitle: React.ComponentType<{
	location: LocationDescriptorObject;
	tag: any;
	className: string;
}> = ({ location, tag: Tag, className }) => {
	let title: string;
	switch (location.pathname) {
		case tradingViewRoute:
			title = "Trading view";
			break;
		default:
			title = "Trading view";
	}

	return <Tag className={className}>{title}</Tag>;
};


const TopMenBarContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 0;
    margin-bottom: 20px;
`;

const GlitnirLogo = styled.div`

`;

export default function TopMenuBar() {
    return <TopMenBarContainer>
        <GlitnirLogo>
            GLITNIR | back testing (
            {
                <CurrentPathTitle
                    className="title"
                    location={location}
                    tag="strong"
                />
            }
            )
        </GlitnirLogo>
        <Nav />
    </TopMenBarContainer>
} 