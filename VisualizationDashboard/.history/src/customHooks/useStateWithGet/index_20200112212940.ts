import React, { useState, useRef, useEffect } from 'react';

export type SetStateCallback<StateType> = (precState: StateType) => StateType

/**
 * hooks that allow us to have a getter for a state!
 * by leveraging a ref for it
 *
 * @export
 * @template StateType
 * @param {StateType} initialState
 * @returns
 */
export function useStateWithGet<StateType = any>(initialState: StateType) {
    const [state, _setState] = useState<StateType>(initialState);
    const stateRef = useRef(state);

    function getState() {
        return stateRef.current;
    }

    function setState(_state: (StateType | SetStateCallback<StateType>)) {
        if (typeof _state === 'function') {
            _setState((precState: StateType) => {
                // we making sure to update the ref before updating the state
                stateRef.current = (_state as SetStateCallback<StateType>)(precState);

                return (_state as SetStateCallback<StateType>)(precState);
            });
        } else {
            // we making sure to update the ref before updating the state
            stateRef.current = _state;
            _setState(_state);
        }
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
