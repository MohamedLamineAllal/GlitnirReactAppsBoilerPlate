const electron = require('electron')
// const settings = require('electron-settings');

// Module to control application life.
// const app = electron.app

// Module to create native browser window.
// const BrowserWindow = electron.BrowserWindow

//better way of getting Classes form electron
const {
	app,
	BrowserWindow,
	Menu,
	globalShortcut
} = electron;

const path = require('path')
// const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
	let screenSize = electron.screen.getPrimaryDisplay().size;
	// Create the browser window.
	mainWindow = new BrowserWindow({
		title: "GLITNIR",
		width: screenSize.width,
		height: screenSize.height,
		icon: path.join(__dirname, './favicon.ico')
	});

	mainWindow.setMenuBarVisibility(false);

	// mainWindow.data = {
	// 	settings: settings.getAll() ///////////////////////////////////
	// }

	mainWindow.setAutoHideMenuBar(true);

	const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../build/index.html')}`;

	// console.log('start url = '.green + startUrl.bgBlue);

	mainWindow.loadURL(startUrl);

	globalShortcut.register('f5', function () {
		mainWindow.webContents.reload();
		// mainWindow.reload()
	})

	globalShortcut.register('CommandOrControl+R', function () {
		mainWindow.reload()
	});

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	})

	//Build menu from template 
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	// the main menu is defined in the bottom at the global scope

	//now we insert the menu
	Menu.setApplicationMenu(mainMenu)
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

var mainMenuTemplate = [
	...[{
		label: "App",
		submenu: [{
				label: "Refresh",
				accelerator: 'Ctrl+r',
				click() {
					app.relaunch();
					app.quit();
				}
			},
			{
				label: "Quite",
				accelerator: process.platform == 'darwin' ? "Command+Q" : 'Ctrl+Q', // add shortcut
				click() {
					app.quit();
				}
			},
		]
	}],
	...(process.env.ELECTRON_START_URL ? [{
		label: "Dev",
		submenu: [{
			label: 'Toggle Developper tools',
			accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
			click() {
				mainWindow.webContents.openDevTools()
			}
		}]
	}] : [])
];