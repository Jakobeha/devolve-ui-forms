import { Bounds, Measurement, React, useInput, useState, VNode } from '@raycenity/devolve-ui'
import { UIControlProps, UIControl } from 'UIControl'
import { useFocus } from 'FocusContext'
import { Strings } from '@raycenity/misc-ts'

export interface SegmentOptionsOpts extends UIControlProps {
  values: string[]
  spacing?: 'uniform' | 'minimal'
  width?: Measurement
  onSelect?: (value: string | null, index: number) => void
}

export const SegmentOptions = UIControl<SegmentOptionsOpts>(({ values, width, spacing, onSelect, enabled, theme }): VNode => {
  width = width ?? (spacing === 'uniform' ? '100%' : Strings.width(values.join(' | ')) + 4)
  const segmentBounds = values.map<Bounds>(value => ({ boundingBox: parentBoundingBox }, prev) => ({
    x: prev === null ? parentBoundingBox.x : prev.left + prev.width - 1,
    y: parentBoundingBox.y,
    z: parentBoundingBox.z + Bounds.BOX_Z,
    width: spacing === 'uniform' ? parentBoundingBox.width! / values.length : value.length + 4,
    height: parentBoundingBox.height,
    anchorX: parentBoundingBox.anchorX,
    anchorY: parentBoundingBox.anchorY
  }))

  const focus = useFocus()
  const selected = useState(-1)
  const isClicked = useState(false)

  useInput(({ name }) => {
    if (focus.isFocused && enabled) {
      if (name === 'enter' || name === 'return') {
        onSelect?.(selected.v === -1 ? null : values[selected.v], selected.v)
        isClicked.v = true
        setTimeout(() => {
          isClicked.v = false
        }, 200)
      } else if (name === 'left') {
        if (selected.v > 0) {
          selected.v--
        }
      } else if (name === 'right') {
        if (selected.v < values.length - 1) {
          selected.v++
        }
      } else if (name === 'up') {
        selected.v = 0
      } else if (name === 'down') {
        selected.v = values.length - 1
      } else if (name === 'escape' || name === 'space') {
        selected.v = -1
      }
    }
  })

  const color = focus.isFocused ? theme.color : theme.unfocusedColor
  const selectedColor = isClicked.v ? theme.activeColor : theme.selectedColor
  return (
    <zbox width={width} height={3} storeBoundsIn='SegmentOptions'>
      {values.map((value, index) => (
        <zbox key={index.toString()} bounds={segmentBounds[index]} clip extend keepBounds='SegmentOptions'>
          {/* index === 0 ? null : <vertical-line x={0} top={1} bottom='100% - 1' color={index === selected.v ? selectedColor : color} /> */}
          {index === 0
            ? null
            : (
              <text x={0} y={1} color={index === selected.v || (selected.v !== -1 && index - 1 === selected.v) ? selectedColor : color}>|</text>
              )}
          <text x={2} y={1} color={index === selected.v ? selectedColor : color}>{value}</text>
          {index === selected.v
            ? (
              <border style='rounded' color={selectedColor} bounds={Bounds.withBoundingBox('SegmentOptions', Bounds.addZ(Bounds.BOX_Z * (values.length + 2), Bounds.FILL))} />
              )
            : null}
        </zbox>
      ))}
      <border style='rounded' color={color} bounds={Bounds.FILL} />
    </zbox>
  )
})
