import { VNode, ColorSpec, Color } from '@raycenity/devolve-ui'

export interface UITheme {
  color?: ColorSpec
  unfocusedColor?: ColorSpec
  activeColor?: ColorSpec
  selectedColor?: ColorSpec
}

export interface UIElementProps {
  theme?: UITheme
}

export interface UIElementProvidedProps {
  theme: Required<UITheme>
}

export function UIElement<T extends UIElementProps> (impl: (props: T & UIElementProvidedProps) => VNode): (props: T) => VNode {
  return (props: T) => {
    const theme = props.theme ?? {}
    const color = theme.color ?? 'white'
    const unfocusedColor = theme.unfocusedColor ?? Color.darken(color, 30)
    const activeColor = theme.activeColor ?? 'yellow'
    const selectedColor = theme.selectedColor ?? 'green'

    return impl({ ...props, theme: { color, unfocusedColor, activeColor, selectedColor } })
  }
}
