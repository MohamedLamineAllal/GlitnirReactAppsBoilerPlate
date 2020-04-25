import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CheckBox, Button, Select } from "grommet";
import { Add } from "grommet-icons";
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../../../../stores'; 
import { Process } from '../../../../../../stores/RootStore/types';

const Container = styled.div`
    height: 40px;
    margin-left: 10px;
`;


const ProcessSelect = styled(Select)`
  color: gray;
  height: 40px;
/* background-color: white; */
`;

export interface SelectOnChangeObj<OptionType> {
  option: OptionType
}

export interface ProcessSelectAndActionProps {
  className?: string
}

export default observer((({
  className
}: ProcessSelectAndActionProps) => {
  const stores = useStores();
  const tradingViewDomainStore = stores.tradingViewStore.domain; 
  const [renderedOptions, setRenderedOptions] = useState([...tradingViewDomainStore.processesList]);

    useEffect(() => {

    }, []);

    return <Container>
        <ProcessSelect
          size="medium"
          placeholder="Select process"
          value={tradingViewDomainStore.selectedProcess || { name: '' }}
          labelKey="name"
          options={renderedOptions.length > 0 ? renderedOptions : tradingViewDomainStore.processesList}
          onChange={(obj: SelectOnChangeObj<Process>) => {
            tradingViewDomainStore.selectedProcessId = obj.option.id as number
          }}
          onClose={() => {
            setRenderedOptions(tradingViewDomainStore.processesList);
          }}
          onSearch={text => {
            const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
            const exp = new RegExp(escapedText, "i");
            setRenderedOptions(tradingViewDomainStore.processesList.filter(o => exp.test(o.name)));
          }}
        />
    </Container>;
})) ;