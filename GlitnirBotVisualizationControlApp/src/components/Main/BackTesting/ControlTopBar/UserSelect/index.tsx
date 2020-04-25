import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { Select } from "grommet";
import { User } from '../../../../../stores/RootStore/types';
import { useStores } from '../../../../../stores';

const Container = styled.div`
    height: 100%;
    flex-shrink: 0;
    flex-grow: 0;
`;


const UserSelect = styled(Select)`
  color: gray;
  height: 100%;
/* background-color: white; */
`;



export interface UserSelectProps {

}

export interface SelectOnChangeObj<OptionType> {
  option: OptionType
}


export default observer((({
  
}) => {
  const stores = useStores();
  const backTestingDomainStore = stores.backTestingStore.domain; 
  const [renderedOptions, setRenderedOptions] = useState([...backTestingDomainStore.usersList]);

    useEffect(() => {

    }, []);

    return <Container>
        <UserSelect
          size="medium"
          placeholder="Select User"
          value={backTestingDomainStore.selectedUser || { username: '' }}
          labelKey="username"
          options={renderedOptions.length > 0 ? renderedOptions : backTestingDomainStore.usersList}
          onChange={(obj: SelectOnChangeObj<User>) => {
            backTestingDomainStore.selectedUserId = obj.option.id as number
          }}
          onClose={() => {
            setRenderedOptions(backTestingDomainStore.usersList);
          }}
          onSearch={text => {
            const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
            const exp = new RegExp(escapedText, "i");
            setRenderedOptions(backTestingDomainStore.usersList.filter(o => exp.test(o.username)));
          }}
        />
    </Container>;
})) ;