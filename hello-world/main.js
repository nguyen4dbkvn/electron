const electron = require('electron')

const app = electron.app

const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// dev
/*const electronHot = require('electron-hot-loader');
electronHot.install();
electronHot.watchJsx([__dirname + '/*.js']);
electronHot.watchCss([__dirname + '/css/*.css']);*/

let mainWindow

function createWindow() {
	mainWindow = new BrowserWindow({width: 800, height: 600, resizable: true});

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))

	mainWindow.webContents.openDevTools()
	//mainWindow.setMenu(null)

	mainWindow.on('closed', function() {
		app.quit()
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('active', function() {
	if (mainWindow === null) {
		createWindow()
	}
})
