import isFunction from './utils/isFunction.js'
import useComputedFromDependencies from './utils/useComputedFromDependencies.js'
import {
  ValueOrFunctionOfProps,
  CurriedPropsAdder,
  DependenciesArgument,
} from './helperTypes.js'

type AddPropsType = <
  TProps extends {},
  TAdditionalProps extends {[key: string]: any}
>(
  createProps: ValueOrFunctionOfProps<TAdditionalProps, TProps>,
  dependencies?: DependenciesArgument<TProps>,
) => CurriedPropsAdder<TProps, TAdditionalProps>

const addProps: AddPropsType = (updater, dependencies) => (props) => {
  const getAddedProps = () => (isFunction(updater) ? updater(props) : updater)

  const addedProps = useComputedFromDependencies({
    compute: getAddedProps,
    dependencies,
    props,
  })

  return {
    ...props,
    ...addedProps,
  }
}

export default addProps
