const { app, BrowserWindow, ipcMain } = require('electron');
const mysql = require("mysql");

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

ipcMain.on('DoConnection', () => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "", // Coloque a senha correta aqui, se necessário
        database: "users"
    });

    connection.connect((err) => {
        if (err) {
            return console.log("Erro de conexão: " + err.stack);
        }
        console.log("Conexão estabelecida com sucesso");

        // Query para selecionar o email_user onde o id_users é 1
        const query = 'SELECT email_users FROM users_info WHERE id_users = 1';

        connection.query(query, (err, results, fields) => {
            if (err) {
                console.log("Erro na query: " + err.stack);
            } else {
                if (results.length > 0) {
                    console.log("Email do usuário:", results[0].email_users);
                } else {
                    console.log("Nenhum usuário encontrado com id_users = 1");
                }
            }

            connection.end(() => {
                console.log("Conexão encerrada");
            });
        });
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
