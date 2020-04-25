import React, { useState, useRef, useEffect } from 'react';



/**
 * hooks that allow us to have a getter for a state!
 * by lavereging a ref for it
 *
 * @export
 * @template StateType
 * @param {StateType} initialState
 * @returns
 */
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

/**
 * For Learning and demonstration purposes and testing
 *
 * @export
 * @template StateType
 * @param {StateType} initialState
 * @returns
 */
export function useStateWithGetEf<StateType = any>(initialState: StateType) {
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
