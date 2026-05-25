export function verificarAutenticacao() {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = '../login/index.html';
    return token;
}

export function obterUsuarioLogado() {
    try {
        const userStr = localStorage.getItem('user');
        return userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
    } catch (error) {
        console.warn("Erro ao carregar usuário.", error);
        return null;
    }
}

export function realizarLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../login/index.html';
}

export function saudarUsuario(elementId) {
    const user = obterUsuarioLogado();
    if (user && user.name) {
        document.getElementById(elementId).textContent = `Olá, ${user.name.split(' ')[0]}`;
    }
}