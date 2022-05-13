import { VNode } from '@raycenity/devolve-ui'
import { UIElementProps, UIElementProvidedProps, UIElement } from 'UIElement'

export interface UIControlProps extends UIElementProps {
  enabled?: boolean
}

export interface UIControlProvidedProps extends UIElementProvidedProps {
  enabled: boolean
}

export function UIControl<T extends UIControlProps> (impl: (props: T & UIControlProvidedProps) => VNode): (props: T) => VNode {
  const impl2 = UIElement<T & Omit<UIControlProvidedProps, keyof UIElementProvidedProps>>(impl)
  return (props: T) => {
    const enabled = props.enabled ?? true
    return impl2({ ...props, enabled })
  }
}
