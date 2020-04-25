import React, { createContext, useContext } from 'react';
import { RootStore } from './RootStore';
import { BackTestingStore } from "./BackTestingStore";
import { TradingViewStore } from "./TradingViewStore";


export interface StoresContext {
	rootStore: RootStore,
	backTestingStore: BackTestingStore,
	tradingViewStore: TradingViewStore
}

const rootStore = new RootStore();

export const stores = {
	rootStore,
	backTestingStore: rootStore.backTestingStore,
	tradingViewStore: rootStore.tradingViewStore 
};

//____________stores context
export const StoresContext = createContext<StoresContext>(stores);

//___________stores provider
export const StoresProvider: React.FC = ({children}) => (
	<StoresContext.Provider
		value={stores}
	>
		{ children }
	</StoresContext.Provider>
);

//___________stores hooks
export function useStores() {
    return useContext(StoresContext);
}