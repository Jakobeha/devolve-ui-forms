globalThis.require = name => {
  switch (name) {
    case 'util':
      // Unfortunately somewhere platform_node requires util
      return {
        TextEncoder,
        TextDecoder
      }
    default:
      console.error(`CommonJS-style unresolved require of ${name}`)
      return null
  }
}

globalThis.UPNG = globalThis.UPNG || {}
