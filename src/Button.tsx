import { Bounds, Color, ColorSpec, Measurement, React, useInput, useState, VNode } from '@raycenity/devolve-ui'
import { useFocus } from 'FocusContext'

export interface ButtonProps {
  color?: ColorSpec
  title: string
  width?: Measurement
  enabled?: boolean
  onClick?: () => void
}

export const Button = ({ color, title, width, enabled, onClick }: ButtonProps): VNode => {
  color = color ?? 'white'
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
  return (
    <zbox width={width} height={3}>
      <text color={focus.isFocused && !isClicked.v ? Color.invert(color) : color} bounds={width !== undefined ? Bounds.CENTER : Bounds({ x: 1, y: 1 })}>{title}</text>
      {focus.isFocused && !isClicked.v ? <color color={color} x={width !== undefined ? 1 : 'prev'} width={width !== undefined ? '100% - 2' : 'prev'} y={1} height={1} /> : null}
      <border style='rounded' color={color} width={width !== undefined ? '100%' : 'prev + 2'} height='100%' />
    </zbox>
  )
}
