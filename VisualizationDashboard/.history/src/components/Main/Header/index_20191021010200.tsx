import React from "react";
import Nav from "../Nav";
import { withRouter, RouterProps, RouteComponentProps } from "react-router";
import { dashboardRoute } from "../../../routes";
import { LocationDescriptorObject } from "history";
import styled from 'styled-components';
import TopMenuBar from "./TopMenuBar";



function Header({ location }: RouteComponentProps) {
	return (
		<header>
			<TopMenuBar />
			<Nav/>
		</header>
	);
}

export default withRouter(Header);
