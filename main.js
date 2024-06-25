const { app, BrowserWindow, ipcMain } = require('electron');
const mysql = require('mysql');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    win.loadFile('index.html');
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

ipcMain.on('DoConnection', (event, data) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '', // Enter the correct password if needed
        database: 'users'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Connection error: ' + err.stack);
            event.reply('connectionResult', 'Connection failed');
            return;
        }
        console.log('Successfully connected to the database');

        const query = 'INSERT INTO users_info (email_users, password_user) VALUES (?, ?)';
        const values = [data.EmailInput, data.PasswordInput];

        console.log('Entered email:', data.EmailInput);
        console.log('Entered password:', data.PasswordInput);

        connection.query(query, values, (err, results) => {
            if (err) {
                console.error('Query error: ' + err.stack);
                event.reply('connectionResult', 'Data insertion failed');
            } else {
                console.log('Data successfully inserted, new record ID:', results.insertId);
                event.reply('connectionResult', 'Data successfully inserted');
            }

            connection.end(() => {
                console.log('Connection closed');
            });
        });
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
