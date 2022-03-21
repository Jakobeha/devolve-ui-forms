import { DevolveUI, React, VNode } from '@raycenity/devolve-ui'
import { Button, FocusProvider } from 'index'

const App = (): VNode => (
  <FocusProvider>
    <zbox width={32} height={32}>
      <vbox x={1} y={1} width='100% - 2' height='100% - 2'>
        <Button title='Button 1' width={16} />
        <Button title='Button 2' />
      </vbox>
      <border style='rounded' width='100%' height='100%' />
    </zbox>
  </FocusProvider>
)

new DevolveUI(App, {}).show()
