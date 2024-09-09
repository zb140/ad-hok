import isFunction from './utils/isFunction.js'
import addProps from './addProps.js'
import {ValueOrFunctionOfProps, CurriedPropsAdder} from './helperTypes.js'

type AddDefaultPropsType = <
  TProps extends {},
  // TAdditionalProps extends Partial<TProps>
  TAdditionalProps extends {}
>(
  createProps: ValueOrFunctionOfProps<TAdditionalProps, TProps>,
) => CurriedPropsAdder<TProps, TAdditionalProps>

const addDefaultProps: AddDefaultPropsType = (createDefaults) =>
  addProps((props) => {
    const defaults = isFunction(createDefaults)
      ? createDefaults(props)
      : createDefaults

    const newProps = {} as typeof defaults

    for (const key in defaults) {
      if ((props as any)[key] == null) {
        newProps[key] = defaults[key]
      }
    }

    return newProps
  })

export default addDefaultProps
