import React from 'react';
import Nav from '../../Nav';
import { LocationDescriptorObject } from 'history';
import { dashboardBaseRoute } from '../../../../routes';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

const CurrentPathTitle: React.ComponentType<{
    location: LocationDescriptorObject;
    tag: any;
    className: string;
}> = ({ location, tag: Tag, className }) => {
    let title: string;

    if ((location.pathname as any).includes(dashboardBaseRoute)) { // TODO: better matching
        const split = (location.pathname as any).split('/');
        title = split[split.length - 1];
    } else {
        title = 'Glitnir Dashboards';
    }

    return <Tag className={className}>{title}</Tag>;
};


const TopMenuBarContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 0;
    margin-bottom: 20px;
`;

const GlitnirLogo = styled.div`

`;

export default withRouter(function TopMenuBar({location}) {
    return <TopMenuBarContainer>
        <GlitnirLogo>
            GLITNIR | Dashboard (
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
    </TopMenuBarContainer>
});
