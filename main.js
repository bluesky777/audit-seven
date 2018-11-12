// Modules to control application life and create native browser window
require('dotenv').config();
const {app, BrowserWindow}  = require('electron')
const {autoUpdater}         = require("electron-updater");
const isDev                 = require('electron-is-dev');
autoUpdater.logger          = require('electron-log');

autoUpdater.logger.transports.file.level = 'info';


// Enable live reload for all the files inside your project directory
//var isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : false;

if (isDev) {
    require('electron-reload')(__dirname);
}


//-------------------------------------------------------------------
// Open a window that displays the version
//
// THIS SECTION IS NOT REQUIRED
//
// This isn't required for auto-updates to work, but it's easier
// for the app to show a window than to have to click "About" to see
// that updates are working.
//-------------------------------------------------------------------
let win;




function sendStatusToWindow(text) {
  win.webContents.send('message', text);
}

const {ipcMain} = require('electron')
ipcMain.on('dame-version', (event, arg) => {
  event.sender.send('toma-version', app.getVersion())
})



ipcMain.on('refrescar-app', (event, arg) => {
  console.log('Main Window');
  win.reload();
})




function createDefaultWindow() {
  win = new BrowserWindow({width: 1200, height: 600});
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
  //win.loadURL(`file://${__dirname}/app/index.html#v${app.getVersion()}`);
  win.loadURL(`file://${__dirname}/app/index.html`);
  win.maximize();
  return win;
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Verificando si hay actualizaciones...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Actualización disponible. Se descargará y reiniciará el programa.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Esta es la última versión.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error al buscar actualización (tal vez no hay internet). ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Velocidad de descarga: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Descargado ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Actualización descargada.');
  autoUpdater.quitAndInstall();
});



app.on('ready', ()=>{
  if (!isDev) {
    autoUpdater.checkForUpdates();
  }
  
  createDefaultWindow();
})

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
  if (win === null) {
    createDefaultWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
