import { BrowserWindow, globalShortcut } from 'electron'

export const setGlobalShortcuts = (mainWindow: BrowserWindow) => {
  globalShortcut.unregisterAll()
  const shortcut = window.localStorage.getItem('shortcut')
  globalShortcut.register(shortcut!, () => {
    mainWindow.show()
  })
  setEscapeShortcut(mainWindow)
}

const setEscapeShortcut = (window: BrowserWindow) => {
  globalShortcut.register('esc', () => {
    window.minimize()
  })
}
