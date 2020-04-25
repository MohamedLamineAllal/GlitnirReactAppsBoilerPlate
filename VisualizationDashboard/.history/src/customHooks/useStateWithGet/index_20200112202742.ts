import React from 'react';

export function useStateWithGet<StateType = any>(initialState: StateType) {
    const [state, setState] = useState<StateType>(initialState);
    
    return [];
}