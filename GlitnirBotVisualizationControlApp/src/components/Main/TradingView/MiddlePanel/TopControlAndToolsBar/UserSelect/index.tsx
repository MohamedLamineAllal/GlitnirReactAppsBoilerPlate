import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import styled from 'styled-components';
import { Select } from "grommet";
import { User } from '../../../../../../stores/RootStore/types';
import { useStores } from '../../../../../../stores';

const Container = styled.div`
    height: 40px;
    margin-left: 10px;
`;


const UserSelect = styled(Select)`
  color: gray;
  height: 40px;
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
  const tradingViewDomainStore = stores.tradingViewStore.domain; 
  const [renderedOptions, setRenderedOptions] = useState([...tradingViewDomainStore.usersList]);
  
    useEffect(() => {

    }, []);

    return <Container>
        <UserSelect
          size="medium"
          placeholder="Select user"
          value={tradingViewDomainStore.selectedUser || { username: ''}}
          labelKey="username"
          options={renderedOptions.length > 0 ? renderedOptions: tradingViewDomainStore.usersList}
          onChange={(obj: SelectOnChangeObj<User>) => {
            console.log('===========select on change==================++++>')
            console.log(toJS(obj.option));
            console.log(toJS((obj as any).value));
            tradingViewDomainStore.selectedUserId = obj.option.id as number
          }}
          onClose={(...args: []) => {
            console.log("==============select on close !!==============+>");
            console.log({
              args
            });
            setRenderedOptions(tradingViewDomainStore.usersList);
          }}
          onSearch={text => {
            const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
            const exp = new RegExp(escapedText, "i");
            setRenderedOptions(tradingViewDomainStore.usersList.filter(o => exp.test(o.username)));
          }}
        />
    </Container>;
})) ;