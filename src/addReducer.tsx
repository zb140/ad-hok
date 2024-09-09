import {useReducer, Reducer} from 'react'

import isFunction from './utils/isFunction.js'
import useMemoized from './utils/useMemoized.js'
import {ValueOrFunctionOfProps} from './helperTypes.js'

type AddReducerType = <TState extends {}, TAction, TProps extends {}>(
  reducer: Reducer<TState, TAction>,
  initialState: ValueOrFunctionOfProps<TState, TProps>,
) => (
  props: TProps,
) => TProps &
  TState & {
    dispatch: (action: TAction) => void
  }

const addReducer: AddReducerType = (reducer, initialState) => (props) => {
  const computedInitialState = useMemoized(
    () => (isFunction(initialState) ? initialState(props) : initialState),
    [],
  )
  const [state, dispatch] = useReducer(reducer, computedInitialState)
  return {
    ...props,
    ...state,
    dispatch,
  }
}

export default addReducer
