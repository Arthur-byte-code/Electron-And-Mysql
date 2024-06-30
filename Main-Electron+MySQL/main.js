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

ipcMain.on('DoLogin', (event, data) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '', // Insira a senha correta se necessário
        database: 'users'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Connection error: ' + err.stack);
            event.reply('loginResult', 'Connection failed');
            return;
        }

        const query = 'SELECT * FROM users_info WHERE email_users = ? AND password_user = ?';
        const values = [data.EmailInput, data.PasswordInput];

        connection.query(query, values, (err, results) => {
            if (err) {
                console.error('Query error: ' + err.stack);
                event.reply('loginResult', 'Login failed');
            } else {
                if (results.length > 0) {
                    console.log('Login successful');
                    event.reply('loginResult', 'Login successful', 'welcome.html');
                } else {
                    console.log('Invalid email or password');
                    event.reply('loginResult', 'Invalid email or password');
                }
            }

            connection.end(() => {
                console.log('Connection closed');
            });
        });
    });
});

ipcMain.on('DoRegister', (event, data) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '', // Insira a senha correta se necessário
        database: 'users'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Connection error: ' + err.stack);
            event.reply('registerResult', 'Connection failed');
            return;
        }

        // Verificar se o email já está registrado
        const checkQuery = 'SELECT * FROM users_info WHERE email_users = ?';
        connection.query(checkQuery, [data.EmailInput], (err, results) => {
            if (err) {
                console.error('Query error: ' + err.stack);
                event.reply('registerResult', 'Registration failed');
                connection.end(() => {
                    console.log('Connection closed');
                });
                return;
            }

            if (results.length > 0) {
                console.log('Email already registered');
                event.reply('registerResult', 'Email already registered');
                connection.end(() => {
                    console.log('Connection closed');
                });
            } else {
                // Se o email não estiver registrado, insere o novo registro
                const insertQuery = 'INSERT INTO users_info (email_users, password_user) VALUES (?, ?)';
                const values = [data.EmailInput, data.PasswordInput];

                connection.query(insertQuery, values, (err, results) => {
                    if (err) {
                        console.error('Query error: ' + err.stack);
                        event.reply('registerResult', 'Registration failed');
                    } else {
                        console.log('Registration successful');
                        event.reply('registerResult', 'Registration successful');
                    }

                    connection.end(() => {
                        console.log('Connection closed');
                    });
                });
            }
        });
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
