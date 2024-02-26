import { join } from 'path'
import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, globalShortcut } from 'electron'
import { Key, keyboard } from '@nut-tree/nut-js'
import { autoUpdater } from 'electron-updater'

const isDev = process.env.npm_lifecycle_event === 'app:dev'

let mainWindow: BrowserWindow

autoUpdater.autoInstallOnAppQuit = true
autoUpdater.autoDownload = false

const handleSelectGitmoji = async () => {
  mainWindow.minimize()
  await keyboard.type(Key.LeftControl, Key.V)
}

const setEscapeShortcut = (window: BrowserWindow) => {
  globalShortcut.register('esc', () => {
    window.minimize()
  })
}

const setGlobalShortcuts = (mainWindow: BrowserWindow, shortcut: string) => {
  globalShortcut.unregisterAll()
  globalShortcut.register(shortcut, () => {
    mainWindow.show()
  })
  setEscapeShortcut(mainWindow)
}

const handleSetShortcut = async (shortcut: string) => {
  setGlobalShortcuts(mainWindow, shortcut)
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    resizable: false,
    maximizable: false,
    width: 800,
    height: 64,
    transparent: true,
    skipTaskbar: true,
    frame: false,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js')
    }
  })

  mainWindow.on('minimize', function (event: any) {
    event.preventDefault()
    mainWindow.minimize()
  })

  // and load the index.html of the app.
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000') // Open the DevTools.
    // mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../../index.html'))
  }
  // mainWindow.loadURL( //this doesn't work on macOS in build and preview mode
  //     isDev ?
  //     'http://localhost:3000' :
  //     join(__dirname, '../../index.html')
  // );

  return mainWindow
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('gitmoji:select', handleSelectGitmoji)
  ipcMain.handle('set:shortcut', async (_event, shortcut) => {
    await handleSetShortcut(shortcut)
  })
  const image = nativeImage.createFromPath(join(__dirname, '../../../public/gitmoji.ico'))
  const appIcon = new Tray(image)
  mainWindow = createWindow()

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: function () {
        mainWindow.show()
      }
    },
    {
      label: 'Quit',
      click: function () {
        app.quit()
      }
    }
  ])
  appIcon.setToolTip('Gitmoji Desktop App')
  appIcon.setContextMenu(contextMenu)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  autoUpdater.checkForUpdates()
})

autoUpdater.on('update-available', () => {
  autoUpdater.downloadUpdate()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('browser-window-blur', () => {
  mainWindow.minimize()
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
