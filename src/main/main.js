const { app, BrowserWindow, ipcMain, WebContents, dialog, shell } = require('electron');
const path = require('path');
const {readFile} = require('node:fs/promises');
const XLSX = require("xlsx");
const sapData = [];
const jiraData = [];
const readXlsxFile = require('read-excel-file/node')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    //showOpenDialog(mainWindow);
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

ipcMain.on('show-open-dialog', (event) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  showOpenDialog(browserWindow);
});


const showOpenDialog = async (browserWindow) => {
  const result = await dialog.showOpenDialog(browserWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Excel', extensions: ['xlsx'] }],
  });

  if (result.canceled) return;

  const { filePaths } = result;
  const [filePath] = filePaths;

  openFile(browserWindow, filePath);
};

const openFile = (browserWindow, filePath) => {
  if(filePath.includes('jira')) {
    openJiraFile(browserWindow, filePath);
  } else {
    openSapFile(browserWindow, filePath);
  }
};

const openSapFile = async (browserWindow, filePath) => {
  const fileContent = await readFile(filePath);
  console.log(filePath);
  const workbook = XLSX.read(fileContent);
  const sheetNames = workbook.SheetNames;
  const sheetName = sheetNames[0];
  var jsa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  jsa2 = jsa.slice(8, jsa.length)
  jsa2.forEach(e => {
    e['Activity Report'] = convertDateFromExcel(e['Activity Report'])
  })

  jsa2.forEach(e => {
    if(isProsjektAktivitet(e)) {
      console.log(e)
    }
  })
  console.log(workbook.SheetNames);
  browserWindow.webContents.send('file-opened', fileContent, filePath);
}

const convertDateFromExcel  = (excelDate) => {
  // Get the number of milliseconds from Unix epoch.
  const unixTime = (excelDate - 25569) * 86400 * 1000;
  return new Date(unixTime);
}

const openJiraFile = async (browserWindow, filePath) => {
  const fileContent = await readFile(filePath);
  console.log(filePath);
  const workbook = XLSX.read(fileContent);
  const sheetNames = workbook.SheetNames;
  const sheetName = sheetNames[0];
  let jsa = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
  console.log(jsa);

  /*
  var jsa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  jsa2 = jsa.slice(8, jsa.length)
  jsa.forEach( e => console.log(e))
   */
  console.log(workbook.SheetNames);
  browserWindow.webContents.send('file-opened', fileContent, filePath);
}

const isProsjektAktivitet = (aktvitet) => {
  if(aktvitet?.__EMPTY && aktvitet?.__EMPTY_1 && (aktvitet.__EMPTY === aktvitet.__EMPTY_1)) {
    return true;
  }
  return false;
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
