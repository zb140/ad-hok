import {useLayoutEffect} from 'react'

import createEffectAdder, {AddEffectType} from './utils/createEffectAdder.js'

const addLayoutEffect: AddEffectType = createEffectAdder(useLayoutEffect)

export default addLayoutEffect
