import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CheckBox, Button, Select } from "grommet";
import { Add } from "grommet-icons";
import ControlTopBar from './ControlTopBar';
import Statistics from "./Statistics/StatisticsItem";
import { observer } from 'mobx-react-lite';

//  styling

const BackTestingContainer = styled.div`
  display: grid;
  width: 100vw;
`;

const BackTestingContent = styled.div`

`;

export default observer(function BackTesting() {
  // const stores = useStores();

  useEffect(() => {

  }, []);

  return (
    <BackTestingContainer>
      <ControlTopBar/>
      <BackTestingContent>
        
      </BackTestingContent>
    </BackTestingContainer>
  );
});



/**
 *  don't forget to handle processes fetching when needed !!!!!!!!!!!
 */
