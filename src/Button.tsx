import { Bounds, Measurement, React, useInput, useState, VNode } from '@raycenity/devolve-ui'
import { UIControlProps, UIControl } from 'UIControl'
import { useFocus } from 'FocusContext'
import { Strings } from '@raycenity/misc-ts'

export interface ButtonProps extends UIControlProps {
  width?: Measurement
  title: string
  onClick?: () => void
}

export const Button = UIControl<ButtonProps>(({ title, width, onClick, enabled, theme }): VNode => {
  width = width ?? Strings.width(title) + 4

  const focus = useFocus()
  const isClicked = useState(false)

  useInput(key => {
    if (focus.isFocused && enabled && (key.name === 'enter' || key.name === 'return')) {
      onClick?.()
      isClicked.v = true
      setTimeout(() => {
        isClicked.v = false
      }, 100)
    }
  })

  const color = isClicked.v ? theme.activeColor : focus.isFocused ? theme.color : theme.unfocusedColor
  return (
    <zbox width={width} height={3}>
      <text color={color} bounds={Bounds.CENTER}>{title}</text>
      <border style='rounded' color={color} width='100%' height='100%' />
    </zbox>
  )
})
