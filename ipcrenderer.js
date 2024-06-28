const { ipcRenderer } = require('electron');

document.getElementById('login-btn').addEventListener('click', () => {
    const EmailInput = document.getElementById('email').value;
    const PasswordInput = document.getElementById('password').value;

    ipcRenderer.send('DoLogin', { EmailInput, PasswordInput });
});

ipcRenderer.on('loginResult', (event, message, mainPage) => {
    alert(message);
    if (mainPage) {
        window.location.href = mainPage;
    }
});
