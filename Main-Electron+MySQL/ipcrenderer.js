const { ipcRenderer } = require('electron');
if (document.getElementById('login-btn')){
document.getElementById('login-btn').addEventListener('click', () => {
    const EmailInput = document.getElementById('email').value;
    const PasswordInput = document.getElementById('password').value;

    ipcRenderer.send('DoLogin', { EmailInput, PasswordInput });
});
}
else{ 
document.getElementById('register-btn').addEventListener('click', () => {
    const EmailInput = document.getElementById('email').value;
    const PasswordInput = document.getElementById('password').value;
    
    ipcRenderer.send('DoRegister', { EmailInput, PasswordInput });
});
}

ipcRenderer.on('loginResult', (event, message, mainPage) => {
    alert(message);
    
        window.location.href = mainPage;
        
    
});
