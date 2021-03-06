const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Hopefully the last parameter in our command line was a url?
var sUrl = process.argv[process.argv.length - 1];

var parsedUrl = url.parse(sUrl);
if (!parsedUrl.protocol || !parsedUrl.host) {
    // No, this isn't a url
    console.log("usage:   npm start <url>\n");
    console.log("example: npm start https://www.gnu.org/graphics/heckert_gnu.svg\n");
    process.exit(0);
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    webPreferences: {
        nodeIntegration: false
    }
  });

  // Load the url
  mainWindow.loadURL(sUrl)

  // Sometimes (especially when displaying svg) the system needs this
  // little bit of a prod before the dragging works
  mainWindow.minimize();

  mainWindow.once('focus', function() {
        mainWindow.restore();
  });

  // Make the whole window draggable apart from a few tags (mostly guesswork I'm afraid),
  // and do it on a timer so the whole window stays draggable.
  setInterval(function() {
        mainWindow.webContents.insertCSS(
            'html,body,svg'
          + '{ -webkit-app-region: drag }'
          + 'a,button,canvas'
          + '{-webkit-app-region: no-drag}')
  }, 1000);

  // Open the DevTools.
//  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
