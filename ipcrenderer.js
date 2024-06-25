const { ipcRenderer } = require('electron');

document.getElementById('btn').addEventListener('click', () => {
    const EmailInput = document.getElementById('email').value;
    const PasswordInput = document.getElementById('password').value;

    ipcRenderer.send('DoConnection', { EmailInput, PasswordInput });
});

ipcRenderer.on('connectionResult', (event, message) => {
    alert(message);
});
