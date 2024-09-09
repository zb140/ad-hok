import {isAddPropTypes} from './addPropTypes.js'
import {isRenderNothing} from './renderNothing.js'
import {isReturns} from './returns.js'
import {isAddWrapper} from './addWrapper.js'
import {isAddWrapperHOC} from './addWrapperHOC.js'
import {isBranch} from './branch-avoid-circular-dependency.js'
import addDisplayName, {isAddDisplayName} from './addDisplayName.js'
import isFunction from './utils/isFunction.js'
import {FlowMaxType} from './flowMaxType.js'

const getArgumentsPropertyName = '__ad-hok-flowMax-getArguments'

const isFlowMax = (func: Function): false | (() => Function[]) =>
  getArgumentsPropertyName in func && (func as any)[getArgumentsPropertyName]

const flowMax = (...funcs: Function[]): ((...args: unknown[]) => unknown) => {
  const getPrecedingFuncs = (index: number) =>
    index === 0 ? [] : funcs.slice(0, index)
  let displayName: string | null = null
  const getFollowingFuncs = (
    index: number,
    {wrappedDisplayName = displayName} = {},
  ) => {
    const followingFuncs = funcs.slice(index + 1)
    if (wrappedDisplayName == null) {
      return followingFuncs
    }
    return [addDisplayName(wrappedDisplayName), ...followingFuncs]
  }
  const flowLength = funcs.length
  const wrapExistingDisplayName = (wrapperStr: string) =>
    `${wrapperStr}(${displayName ?? ''})`
  if (flowLength) {
    for (let funcIndex = 0; funcIndex < funcs.length; funcIndex++) {
      const func = funcs[funcIndex]
      if (!isFunction(func)) {
        throw new TypeError('Expected a function')
      }
      const getNestedFlowMaxArguments = isFlowMax(func)
      if (getNestedFlowMaxArguments) {
        return flowMax(
          ...getPrecedingFuncs(funcIndex),
          ...getNestedFlowMaxArguments(),
          ...getFollowingFuncs(funcIndex),
        )
      }
      if (
        isAddPropTypes(func) ||
        isAddWrapper(func) ||
        isAddWrapperHOC(func) ||
        isBranch(func)
      ) {
        const wrappedDisplayName: string | undefined = isAddPropTypes(func)
          ? wrapExistingDisplayName('addPropTypes')
          : isAddWrapper(func)
          ? wrapExistingDisplayName('addWrapper')
          : isAddWrapperHOC(func)
          ? wrapExistingDisplayName('addWrapperHOC')
          : undefined
        const newFollowingFlowMax = flowMax(
          ...getFollowingFuncs(funcIndex, {wrappedDisplayName}),
        )
        if (
          (newFollowingFlowMax as any).displayName == null ||
          (newFollowingFlowMax as any).displayName === 'ret'
        ) {
          ;(newFollowingFlowMax as any).displayName = wrappedDisplayName
        }
        const newFlowMax = flowMax(
          ...getPrecedingFuncs(funcIndex),
          func(newFollowingFlowMax),
        )
        // Expose original arguments if we're nested
        ;(newFlowMax as any)[getArgumentsPropertyName] = () => funcs
        return newFlowMax
      }
      const addedDisplayName = isAddDisplayName(func)
      if (addedDisplayName) {
        displayName = addedDisplayName[0]
      }
    }
  }
  const ret = (...args: any[]) => {
    if (!funcs.length) return args[0]
    let index = 0
    let props = null
    while (index < flowLength) {
      const func = funcs[index]
      const currentArgs: any[] = index === 0 ? args : [props]
      props = func(...currentArgs)
      if (isRenderNothing(props)) {
        return null
      }
      const returnsVal = isReturns(props)
      if (returnsVal) {
        return returnsVal[0]
      }
      index++
    }
    return props
  }
  if (displayName != null) {
    ret.displayName = displayName
  }
  ;(ret as any)[getArgumentsPropertyName] = () => funcs
  return ret
}

const flowMaxPublishedType = flowMax as FlowMaxType
export default flowMaxPublishedType
