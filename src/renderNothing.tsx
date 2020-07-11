import {CurriedUnchangedProps} from './helperTypes'

const nonce = {}

export const isRenderNothing = (value: unknown): boolean => value === nonce

type RenderNothingType = <TProps>() => (props: TProps) => typeof nonce

export const renderNothing: RenderNothingType = () => (_props) => nonce

type RenderNothingPublishedType = <TProps>() => CurriedUnchangedProps<TProps>

const renderNothingPublishedType = renderNothing as RenderNothingPublishedType
export default renderNothingPublishedType
