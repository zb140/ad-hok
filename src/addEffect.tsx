import {useEffect} from 'react'

import createEffectAdder, {AddEffectType} from './utils/createEffectAdder.js'

const addEffect: AddEffectType = createEffectAdder(useEffect)

export default addEffect
