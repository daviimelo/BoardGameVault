import { register, login } from '../../shared/services/auth.js'; 

const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const btnShowRegister = document.getElementById('btn-show-register');
const btnShowLogin = document.getElementById('btn-show-login');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

btnShowRegister.addEventListener('click', (e) => {
    e.preventDefault();
    limparMensagens();
    loginContainer.classList.add('d-none');
    registerContainer.classList.remove('d-none');
    registerContainer.classList.add('animate-enter');
});

btnShowLogin.addEventListener('click', (e) => {
    e.preventDefault();
    limparMensagens();
    registerContainer.classList.add('d-none');
    loginContainer.classList.remove('d-none');
    loginContainer.classList.add('animate-enter');
});

// Cadastro de Usuário
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    limparMensagens();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    const btnSubmit = registerForm.querySelector('button[type="submit"]');

    if (password !== confirmPassword) {
        exibirMensagem('register-container', 'As senhas não coincidem.', 'danger');
        return;
    }

    try {
        btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Criando...';
        btnSubmit.disabled = true;

        await register({ name, email, password, confirmPassword });

        exibirMensagem('register-container', 'Usuário registrado com sucesso! Faça seu login.', 'success');
        registerForm.reset();

        setTimeout(() => {
            btnShowLogin.click();
        }, 5500);

    } catch (error) {
        exibirMensagem('register-container', error.message || 'Erro ao realizar o cadastro.', 'danger');
    } finally {
        btnSubmit.innerHTML = 'Criar conta';
        btnSubmit.disabled = false;
    }
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    limparMensagens();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btnSubmit = loginForm.querySelector('button[type="submit"]');

    try {
        btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Entrando...';
        btnSubmit.disabled = true;

        const data = await login(email, password);

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        exibirMensagem('login-container', 'Acesso liberado! Abrindo o cofre...', 'success');

        setTimeout(() => {
            window.location.href = '../home/index.html';
        }, 1000);

    } catch (error) {
        exibirMensagem('login-container', error.message, 'danger');
        btnSubmit.innerHTML = 'Entrar';
        btnSubmit.disabled = false;
    }
});

// Funções Auxiliares

function exibirMensagem(containerId, texto, tipo) {
    limparMensagens();
    const container = document.getElementById(containerId);
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show mt-3 custom-alert`;
    alertDiv.innerHTML = `
        <span>${texto}</span>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    container.appendChild(alertDiv);
}

function limparMensagens() {
    const alertas = document.querySelectorAll('.custom-alert');
    alertas.forEach(alerta => alerta.remove());
}
