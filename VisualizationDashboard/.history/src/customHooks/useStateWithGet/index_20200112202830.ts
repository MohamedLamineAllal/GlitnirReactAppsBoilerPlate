import React, { useState, useRef } from 'react';

export function useStateWithGet<StateType = any>(initialState: StateType) {
    const [state, setState] = useState<StateType>(initialState);
    const stateRef = useRef(state);
    useEffect(() => {

    }, [state])
    return [];
}