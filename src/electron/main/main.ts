import { join } from 'path'
import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, globalShortcut } from 'electron'

const isDev = process.env.npm_lifecycle_event === 'app:dev'

let mainWindow: BrowserWindow

const handleSelectGitmoji = () => {
  mainWindow.hide()
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
    mainWindow.hide()
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
  const image = nativeImage.createFromPath(join(__dirname, 'gitmoji.ico'))
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

  globalShortcut.register('Alt+G', () => {
    mainWindow.show()
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
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
  mainWindow.hide()
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
