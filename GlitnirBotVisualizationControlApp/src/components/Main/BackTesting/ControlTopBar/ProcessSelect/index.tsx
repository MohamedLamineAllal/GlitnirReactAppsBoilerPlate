import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { Select } from "grommet";
import { Add } from "grommet-icons";
import { Process } from '../../../../../stores/RootStore/types';
import { useStores } from '../../../../../stores';
import { SimpleButton } from '../../../../shared/UI_Elements/Button';

const Container = styled.div`
  height: 100%;
  flex-shrink: 0;
  flex-grow: 0;
  margin-right: 10px;
`;


const ProcessSelect = styled(Select)`
  color: gray;
  height: 100%;
/* background-color: white; */
`;


export interface ProcessSelectProps {

}

export interface SelectOnChangeObj<OptionType> {
  option: OptionType
}


export default observer((({
  
}) => {
  const stores = useStores();
  const backTestingDomainStore = stores.backTestingStore.domain; 
  const [renderedOptions, setRenderedOptions] = useState([...backTestingDomainStore.processesList]);

    useEffect(() => {

    }, []);

    return <Container>
        <ProcessSelect
          size="medium"
          placeholder="Select Process"
          value={backTestingDomainStore.selectedProcess || { name: ''}}
          labelKey="name"
          options={renderedOptions.length > 0 ? renderedOptions: backTestingDomainStore.processesList}
          onChange={(obj: SelectOnChangeObj<Process>) => {
            backTestingDomainStore.selectedProcessId = obj.option.id as number
          }}
          onClose={() => {
            setRenderedOptions(backTestingDomainStore.processesList);
          }}
          onSearch={text => {
            const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
            const exp = new RegExp(escapedText, "i");
            setRenderedOptions(backTestingDomainStore.processesList.filter(o => exp.test(o.name)));
          }}
        />
        {/* <SimpleButton primary icon={<Add />} label="Creat New" onClick={() => {}} /> */}
    </Container>;
})) ;