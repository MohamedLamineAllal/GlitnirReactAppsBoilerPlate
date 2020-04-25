import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import LeftToolBar from './LeftToolsBar';
import RightToolBar from './RightToolsBar';
import MiddlePanel from './MiddlePanel';

const TradingViewPageContainer = styled.div`
	/* border: solid 5px red; */
	display: flex;
	width: 100vw;
	height: 100vh;
`;



export default function TradingView() {
	useEffect(() => {}, []);

	return (
		<TradingViewPageContainer>
			<LeftToolBar/>
			<MiddlePanel/>
			<RightToolBar/>
		</TradingViewPageContainer>
	);
}
