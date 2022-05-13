import { Bounds, Color, ColorSpec, Measurement, React, useInput, useState, VNode } from '@raycenity/devolve-ui'
import { useFocus } from 'FocusContext'
import { Strings } from '@raycenity/misc-ts'

export interface ButtonProps {
  color?: ColorSpec
  unfocusedColor?: ColorSpec
  actionColor?: ColorSpec
  enabled?: boolean
  width?: Measurement
  title: string
  onClick?: () => void
}

export const Button = ({ color, unfocusedColor, actionColor, enabled, width, title, onClick }: ButtonProps): VNode => {
  color = color ?? 'white'
  unfocusedColor = unfocusedColor ?? Color.darken(color, 30)
  actionColor = actionColor ?? 'yellow'
  width = width ?? Strings.width(title) + 4

  const focus = useFocus()
  const isClicked = useState(false)

  useInput(key => {
    if (focus.isFocused && enabled !== false && (key.name === 'enter' || key.name === 'return')) {
      onClick?.()
      isClicked.v = true
      setTimeout(() => {
        isClicked.v = false
      }, 100)
    }
  })

  color = isClicked.v ? actionColor : focus.isFocused ? color : unfocusedColor
  return (
    <zbox width={width} height={3}>
      <text color={color} bounds={Bounds.CENTER}>{title}</text>
      <border style='rounded' color={color} width='100%' height='100%' />
    </zbox>
  )
}
