const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 450,
    height: 600,
    autoHideMenuBar: true, // скрыть меню сверху
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);