import { Color, ColorSpec, Measurement, React, useInput, useState, VNode } from '@raycenity/devolve-ui'
import { useFocus } from 'FocusContext'

export interface TextFieldProps {
  color?: ColorSpec
  unfocusedColor?: ColorSpec
  actionColor?: ColorSpec
  enabled?: boolean
  width?: Measurement
  placeholder?: string
  onInput?: (value: string) => void
  onEnter?: (value: string) => void
}

export const TextField = ({ color, unfocusedColor, actionColor, enabled, width, placeholder, onInput, onEnter }: TextFieldProps): VNode => {
  color = color ?? 'white'
  unfocusedColor = unfocusedColor ?? Color.darken(color, 30)
  actionColor = actionColor ?? 'yellow'
  placeholder = placeholder ?? ''
  width = width ?? '100%'

  const focus = useFocus()
  const value = useState('')
  const cursor = useState(0)
  const didEnter = useState(false)

  useInput(({name}) => {
    if (focus.isFocused && enabled !== false) {
      if (name === 'enter' || name === 'return') {
        onEnter?.(value.v)
        didEnter.v = true
        setTimeout(() => {
          didEnter.v = false
        }, 100)
      } else if (name === 'backspace' || (name === 'delete' && value.v.length === cursor.v)) {
        if (cursor.v > 0) {
          value.v = value.v.slice(0, cursor.v - 1) + value.v.slice(cursor.v)
          cursor.v--
          onInput?.(value.v)
        }
      } else if (name === 'delete') {
        value.v = value.v.slice(0, cursor.v - 1) + value.v.slice(cursor.v)
        onInput?.(value.v)
      } else if (name === 'left') {
        if (cursor.v > 0) {
          cursor.v--
        }
      } else if (name === 'right') {
        if (cursor.v < value.v.length) {
          cursor.v++
        }
      } else if (name === 'up') {
        cursor.v = 0
      } else if (name === 'down') {
        cursor.v = value.v.length
      } else if (name.length === 1) {
        value.v = value.v.slice(0, cursor.v) + name + value.v.slice(cursor.v)
        cursor.v++
        onInput?.(value.v)
      }
    }
  })

  let text = value.v === '' ? placeholder : value.v
  // Add cursor to indicate focus
  if (focus.isFocused) {
    text = `${text.slice(0, cursor.v)}█${text.slice(cursor.v + 1)}`
  }

  color = didEnter.v ? actionColor : focus.isFocused ? color : unfocusedColor
  const textColor = value.v === '' ? unfocusedColor : color
  return (
    <zbox width={width} height={3}>
      <text color={textColor} x={2} y={1}>{text}</text>
      <border style='rounded' color={color} width='100%' height='100%' />
    </zbox>
  )
}
