import { createStateContext, useInput, VNode, React, useState, useEffect } from '@raycenity/devolve-ui'

interface FocusState {
  ids: number[]
  nextFreeId: number
  focusedIndex: number | null
}

const focusContext = createStateContext<FocusState>({ ids: [], nextFreeId: 0, focusedIndex: null })

/**
 * Wrap your UI controls with this to enable focus, and tab and shift-tab to change focus.
 */
export const FocusProvider = ({ children }: { children?: VNode }): VNode => {
  const focus = focusContext.useProvide({
    ids: [],
    nextFreeId: 0,
    focusedIndex: 0
  })

  useInput(({ name, shift }) => {
    if (name === 'tab') {
      if (shift) {
        focus.focusedIndex.v = focus.focusedIndex.v === null ? 0 : focus.focusedIndex.v - 1
      } else {
        focus.focusedIndex.v = focus.focusedIndex.v === null ? -1 : focus.focusedIndex.v + 1
      }
    }
  })

  return (
    <box>
      {children}
    </box>
  )
}

export interface MyFocus {
  isFocused: boolean
  makeFocused: () => void
}

export const useFocus = (): MyFocus => {
  const myId = useState(-1)
  const focus = focusContext.useConsume()

  if (focus === null) {
    // To keep number of hooks the same
    useEffect(() => {
      return () => {}
    }, { onChange: [focus] })

    return {
      isFocused: false,
      makeFocused: () => {
        console.warn('can\'t make focused because there is no parent FocusProvider')
      }
    }
  } else {
    useEffect(() => {
      // Get id
      const myRealId = focus.nextFreeId.v++
      myId.v = myRealId
      // Add to focusable elements
      focus.ids.push(myRealId)

      return () => {
        const myIndex = focus.ids.indexOf(myRealId)
        const focusedIndexModulo = focus.focusedIndex.v === null
          ? null
          // positive modulo
          : ((focus.focusedIndex.v % focus.ids.length) + focus.ids.length) % focus.ids.length

        if (focus.ids.length === 1) {
          // No elements left
          focus.focusedIndex.v = null
        } else if (focusedIndexModulo === myIndex) {
          // Focus the previous element
          focus.focusedIndex.v!--
        }
        // Remove from focusable elements
        focus.ids.splice(myIndex, 1)
      }
    }, { onChange: [focus] })

    const myIndex = focus.ids.indexOf(myId.v)
    const focusedIndexModulo = focus.focusedIndex.v === null
      ? null
      // positive modulo
      : ((focus.focusedIndex.v % focus.ids.length) + focus.ids.length) % focus.ids.length

    return {
      isFocused: myIndex === focusedIndexModulo,
      makeFocused: () => {
        focus.focusedIndex.v = myIndex
      }
    }
  }
}
