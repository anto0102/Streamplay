const { app, BrowserWindow } = require('electron');
const path = require('path');
const serve = require('electron-serve');

const loadURL = serve({ directory: 'out' });

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        backgroundColor: '#000000',
        title: 'Cinemax',
    });

    win.setMenuBarVisibility(false);

    if (app.isPackaged) {
        loadURL(win);
    } else {
        // In dev, we can still load from the serve directory
        loadURL(win);
    }
}

app.whenReady().then(() => {
    // YouTube Error 152-4 / embedding fix
    const { session } = require('electron');
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

    session.defaultSession.webRequest.onBeforeSendHeaders(
        { urls: ['*://*.youtube.com/*', '*://*.youtube-nocookie.com/*', '*://*.googlevideo.com/*'] },
        (details, callback) => {
            details.requestHeaders['Referer'] = 'https://www.youtube.com/';
            details.requestHeaders['Origin'] = 'https://www.youtube.com/';
            details.requestHeaders['User-Agent'] = userAgent;
            callback({ cancel: false, requestHeaders: details.requestHeaders });
        }
    );

    createWindow();

    // Auto Update Setup
    const { autoUpdater } = require('electron-updater');

    // Configurazione autoUpdater
    autoUpdater.autoDownload = false; // Chiediamo prima di scaricare

    autoUpdater.on('update-available', () => {
        const { dialog } = require('electron');
        dialog.showMessageBox({
            type: 'info',
            title: 'Aggiornamento disponibile',
            message: 'È stata trovata una nuova versione. Vuoi scaricarla ora?',
            buttons: ['Sì', 'No']
        }).then((result) => {
            if (result.response === 0) {
                autoUpdater.downloadUpdate();
            }
        });
    });

    autoUpdater.on('update-downloaded', () => {
        const { dialog } = require('electron');
        dialog.showMessageBox({
            title: 'Aggiornamento pronto',
            message: 'L\'aggiornamento è stato scaricato. L\'app verrà riavviata per applicarlo.',
            buttons: ['Riavvia ora']
        }).then(() => {
            autoUpdater.quitAndInstall();
        });
    });

    autoUpdater.checkForUpdatesAndNotify();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
