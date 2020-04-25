import React, { useState, useRef, useEffect } from 'react';

export function useStateWithGet<StateType = any>(initialState: StateType) {
    const [state, setState] = useState<StateType>(initialState);
    const stateRef = useRef(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    function getState() {
        return stateRef.current;
    }

    return [state, setState, getState];
}
