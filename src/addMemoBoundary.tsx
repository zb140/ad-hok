import React, {ComponentType, FC} from 'react'

import {addWrapperHOC} from './addWrapperHOC.js'
import get from './utils/get.js'
import isFunction from './utils/isFunction.js'
import some from './utils/some.js'
import {CurriedUnchangedProps, DependenciesArgument} from './helperTypes.js'

const memo = <TProps extends {}>(
  compare: ((prevProps: TProps, props: TProps) => boolean) | undefined,
) => (Component: ComponentType<TProps>) => React.memo(Component, compare)

const compareDependenciesArray = <TProps extends {}>(
  dependencies: string[],
) => (prevProps: TProps, props: TProps) =>
  !some(
    (dependency) => get(dependency, prevProps) !== get(dependency, props),
    dependencies,
  )

export const addMemoBoundary = <TProps extends {}>(
  dependencies?: DependenciesArgument<TProps>,
): ((Component: ComponentType<TProps>) => FC<TProps>) => {
  const compareFunc =
    isFunction(dependencies) || dependencies == null
      ? dependencies
      : compareDependenciesArray<TProps>(dependencies)

  return addWrapperHOC(memo<TProps>(compareFunc))
}

type AddMemoBoundaryType = <TProps extends {}>(
  dependencies?: DependenciesArgument<TProps>,
) => CurriedUnchangedProps<TProps>

const addMemoBoundaryPublishedType = addMemoBoundary as AddMemoBoundaryType
export default addMemoBoundaryPublishedType
