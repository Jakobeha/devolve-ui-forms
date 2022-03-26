import { Bounds, Color, ColorSpec, Measurement, React, useInput, useState, VNode } from '@raycenity/devolve-ui'
import { useFocus } from 'FocusContext'
import { Strings } from '@raycenity/misc-ts'

export interface ButtonProps {
  color?: ColorSpec
  title: string
  width?: Measurement
  enabled?: boolean
  onClick?: () => void
}

export const Button = ({ color, title, width, enabled, onClick }: ButtonProps): VNode => {
  color = color ?? 'white'
  width = width ?? Strings.width(title) + 4
  const focus = useFocus()
  const isClicked = useState(false)
  useInput(key => {
    if (focus.isFocused && enabled !== false && key.name === 'enter') {
      onClick?.()
      isClicked.v = true
      setTimeout(() => {
        isClicked.v = false
      }, 100)
    }
  })
  const invertColor = focus.isFocused && !isClicked.v
  return (
    <zbox width={width} height={3}>
      <text color={invertColor ? Color.invert(color) : color} bounds={Bounds.CENTER}>{title}</text>
      {invertColor ? <color color={color} bounds={Bounds.PREV} y={1} height={1} /> : null}
      <border style='rounded' color={color} width='100%' height='100%' />
    </zbox>
  )
}
